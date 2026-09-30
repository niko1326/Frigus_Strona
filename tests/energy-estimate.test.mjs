import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import {
  calculateEnergyEstimate as calculateCooling,
  calculateHeatingEstimate as calculateHeating,
  formatEnergyNumber
} from '../src/utils/energy-estimate.mjs';
import {
  changeCalculatorMode,
  createCalculatorState,
  selectCalculatorModel,
  stateFromQuery
} from '../src/utils/energy-calculator-state.mjs';
import { ENERGY_MODELS, GREE_MODELS, KAISAI_MODELS } from '../src/config/lineups.ts';
import {
  buildEnergyCalculatorHref,
  buildEnergyCalculatorLabel
} from '../src/utils/product-energy-link.mjs';

const coolingDefaults = {
  power: 3.5,
  seer: 6.5,
  area: 35,
  price: 1.2,
  usage: 'standard',
  insulation: 'standard'
};

test('cooling keeps capacity × 350 / SEER as its reference', () => {
  for (const [power, seer, expected, rounded] of [
    [3.5, 8.5, 144.11764705882354, '144'],
    [3.5, 6.5, 188.46153846153845, '188'],
    [5, 6.5, 269.2307692307692, '269'],
    [2.5, 8, 109.375, '109']
  ]) {
    const result = calculateCooling({ ...coolingDefaults, power, seer });
    assert.ok(Math.abs(result.referenceKwh - expected) < 1e-9);
    assert.equal(formatEnergyNumber(result.referenceKwh), rounded);
    assert.equal(result.seasonCost, result.referenceKwh * coolingDefaults.price);
  }
});

test('cooling range responds to area and usage without false precision', () => {
  const occasional = calculateCooling({ ...coolingDefaults, usage: 'occasional' });
  const standard = calculateCooling(coolingDefaults);
  const intensive = calculateCooling({ ...coolingDefaults, usage: 'intensive' });
  const largerRoom = calculateCooling({ ...coolingDefaults, area: 50 });
  const wellInsulated = calculateCooling({ ...coolingDefaults, insulation: 'good' });
  const poorlyInsulated = calculateCooling({ ...coolingDefaults, insulation: 'poor' });
  assert.ok(occasional.usageKwh[1] < standard.usageKwh[1]);
  assert.ok(standard.usageKwh[1] < intensive.usageKwh[1]);
  assert.ok(largerRoom.usageKwh[0] > standard.usageKwh[0]);
  assert.ok(poorlyInsulated.usageKwh[1] > wellInsulated.usageKwh[1]);
  assert.equal(standard.capacityStatus, 'borderline');
});

test('cooling rejects invalid input instead of replacing it with defaults', () => {
  for (const patch of [
    { power: 0 }, { seer: 0 }, { area: 0 }, { price: -1 }, { usage: 'unknown' }, { insulation: 'unknown' }
  ]) {
    assert.throws(() => calculateCooling({ ...coolingDefaults, ...patch }), RangeError);
  }
});

test('heating uses area, insulation, usage and SCOP', () => {
  const supplemental = calculateHeating({
    area: 20, insulation: 'good', usage: 'supplemental', scop: 5, heatingCapacityKw: 3.8, price: 1.2
  });
  const regular = calculateHeating({
    area: 35, insulation: 'standard', usage: 'regular', scop: 4.6, heatingCapacityKw: 4, price: 1.2
  });
  const primary = calculateHeating({
    area: 50, insulation: 'poor', usage: 'primary', scop: 4, heatingCapacityKw: 5, price: 1.2
  });
  assert.deepEqual(supplemental.electricityKwh.map(Math.round), [63, 165]);
  assert.deepEqual(regular.electricityKwh.map(Math.round), [371, 822]);
  assert.deepEqual(primary.electricityKwh.map(Math.round), [1350, 2475]);
  assert.equal(supplemental.requiresIndividualSelection, false);
  assert.equal(primary.requiresIndividualSelection, true);
});

test('heating preserves expected physical relationships', () => {
  const base = {
    area: 35, insulation: 'standard', usage: 'regular', scop: 4.6, heatingCapacityKw: 4, price: 1.2
  };
  const energy = (patch = {}) => calculateHeating({ ...base, ...patch }).electricityKwh[1];
  assert.ok(energy({ insulation: 'poor' }) > energy());
  assert.ok(energy({ area: 50 }) > energy());
  assert.ok(energy({ usage: 'primary' }) > energy());
  assert.ok(energy({ scop: 5.5 }) < energy());
});

test('mode switch preserves all shared values and cooling-specific state', () => {
  const configured = createCalculatorState({
    selectedBrand: 'gree', selectedModel: 'gree-pular', selectedVariant: 3.2,
    area: 30, electricityPrice: 1.2, coolingUsage: 'intensive'
  });
  const heating = changeCalculatorMode(configured, 'heating');
  const coolingAgain = changeCalculatorMode(heating, 'cooling');
  assert.deepEqual(
    { ...coolingAgain, mode: undefined },
    { ...configured, mode: undefined }
  );
});

test('heating-specific choices survive a round trip through cooling', () => {
  const configured = createCalculatorState({ insulation: 'good', heatingUsage: 'primary', mode: 'heating' });
  const result = changeCalculatorMode(changeCalculatorMode(configured, 'cooling'), 'heating');
  assert.equal(result.insulation, 'good');
  assert.equal(result.heatingUsage, 'primary');
});

test('central model data exposes Nordic and Pular variants exactly', () => {
  const nordic = ENERGY_MODELS.find((model) => model.slug === 'kaisai-nordic');
  const pular = ENERGY_MODELS.find((model) => model.slug === 'gree-pular');
  assert.deepEqual(nordic.variants.map((variant) => variant.powerKw), [3.5]);
  assert.deepEqual(pular.variants.map((variant) => variant.powerKw), [2.5, 3.2, 4.6, 6.2]);
});

test('every listed variant has complete, positive manufacturer energy data', () => {
  const incomplete = ENERGY_MODELS.flatMap((model) => model.variants
    .filter((variant) => [
      variant.coolingCapacityKw,
      variant.heatingCapacityKw,
      variant.seer,
      variant.scop
    ].some((value) => !Number.isFinite(value) || value <= 0))
    .map((variant) => `${model.slug}:${variant.label}`));

  assert.deepEqual(incomplete, []);
  assert.deepEqual(
    ENERGY_MODELS.find((model) => model.slug === 'kaisai-air')
      .variants.find((variant) => variant.powerKw === 3.4),
    {
      label: '3,4',
      powerKw: 3.4,
      coolingCapacityKw: 3.4,
      heatingCapacityKw: 3.4,
      seer: 6.1,
      scop: 4
    }
  );
});

test('every Gree series has complete data for its dedicated catalog page', async () => {
  assert.deepEqual(
    GREE_MODELS.map((model) => model.product.slug),
    [
      'g-time',
      'cosmo-pearl',
      'clivia',
      'airy',
      'amber-prestige',
      'u-crown-silver',
      'fairy',
      'pular',
      'pular-pro'
    ]
  );

  for (const model of GREE_MODELS) {
    assert.ok(model.product.description.length > 80);
    assert.ok(model.product.recommendedFor.length >= 3);
    const differentiatingCopy = [
      model.tagline,
      model.product.description,
      ...model.product.recommendedFor,
      ...model.features
    ].join(' ');
    assert.doesNotMatch(differentiatingCopy, /sterowanie (?:przez aplikację|Wi-Fi)|jonizac/i);
  }

  const expectedPrices = new Map([
    ['g-time', { minimum: 4599, variants: [4599, 4799, 6199, 6599] }],
    ['cosmo-pearl', { minimum: 4399, variants: [4399, 4599, 5899, 6399] }],
    ['clivia', { minimum: 4399, variants: [4399, 4599, 5899, 6499], colors: [4499, 4599, 5999, 6499] }],
    ['airy', { minimum: 4899, variants: [4899, 5099, 6299, 6799], colors: [5099, 5199, 6399, 6899] }],
    ['amber-prestige', { minimum: 5599, variants: [5599, 5799, 6399, 6999] }],
    ['u-crown-silver', { minimum: 5499, variants: [5499, undefined, undefined] }],
    ['fairy', { minimum: 3799, variants: [3799, 3999, 5499, 6099] }],
    ['pular', { minimum: 3399, variants: [3399, 3499, 4399, 5199] }],
    ['pular-pro', { minimum: 3999, variants: [3999, 4199, 5599, 6199] }]
  ]);

  for (const model of GREE_MODELS) {
    const expected = expectedPrices.get(model.product.slug);
    assert.ok(expected);
    assert.equal(model.product.priceFromPLN, expected.minimum);
    assert.deepEqual(model.variants.map((variant) => variant.priceFromPLN), expected.variants);
    assert.deepEqual(
      model.variants.map((variant) => variant.colorPriceFromPLN).filter(Boolean),
      expected.colors ?? []
    );
  }

  const expectedColors = new Map([
    ['clivia', 5],
    ['airy', 4],
    ['fairy', 3],
    ['pular-pro', 2]
  ]);

  for (const model of GREE_MODELS) {
    const colors = model.product.colors ?? [];
    assert.equal(colors.length, expectedColors.get(model.product.slug) ?? 0);
    assert.equal(new Set(colors.map((color) => color.image)).size, colors.length);

    for (const color of colors) {
      assert.ok(color.name.length > 0);
      assert.match(color.image, /^\/photos\/modele\/kolory\/.+\.webp$/);
      assert.match(color.swatch, /^#[0-9a-f]{6}$/i);
      await access(new URL(`../public${color.image}`, import.meta.url));
    }
  }
});

test('changing model preserves power only when the new model offers it', () => {
  const pularPro = ENERGY_MODELS.find((model) => model.slug === 'gree-pular-pro');
  const gTime = ENERGY_MODELS.find((model) => model.slug === 'gree-g-time');
  const pular = ENERGY_MODELS.find((model) => model.slug === 'gree-pular');
  const initial = createCalculatorState({
    selectedVariant: 3.5,
    area: 42,
    electricityPrice: 1.35,
    insulation: 'good',
    coolingUsage: 'intensive',
    heatingUsage: 'primary'
  });
  const changed = selectCalculatorModel(initial, gTime);
  assert.equal(selectCalculatorModel(initial, pularPro).selectedVariant, 3.5);
  assert.equal(changed.selectedVariant, 3.5);
  assert.equal(selectCalculatorModel(initial, pular).selectedVariant, null);
  assert.deepEqual(
    {
      area: changed.area,
      price: changed.electricityPrice,
      insulation: changed.insulation,
      coolingUsage: changed.coolingUsage,
      heatingUsage: changed.heatingUsage
    },
    { area: 42, price: 1.35, insulation: 'good', coolingUsage: 'intensive', heatingUsage: 'primary' }
  );
});

test('deep links resolve model, power and mode', () => {
  const cooling = stateFromQuery('?model=gree-pular-pro&power=3.5&mode=cooling', ENERGY_MODELS);
  const heating = stateFromQuery('?model=gree-pular-pro&power=3.5&mode=heating', ENERGY_MODELS);
  assert.equal(cooling.selectedModel, 'gree-pular-pro');
  assert.equal(cooling.selectedVariant, 3.5);
  assert.equal(cooling.mode, 'cooling');
  assert.equal(heating.selectedModel, 'gree-pular-pro');
  assert.equal(heating.selectedVariant, 3.5);
  assert.equal(heating.mode, 'heating');
});

test('product deep links leave customer inputs empty', () => {
  const state = stateFromQuery('?model=gree-pular&power=3.2', ENERGY_MODELS);
  assert.deepEqual(
    {
      model: state.selectedModel,
      power: state.selectedVariant,
      area: state.area,
      price: state.electricityPrice,
      insulation: state.insulation,
      coolingUsage: state.coolingUsage,
      heatingUsage: state.heatingUsage
    },
    {
      model: 'gree-pular',
      power: 3.2,
      area: null,
      price: null,
      insulation: '',
      coolingUsage: '',
      heatingUsage: ''
    }
  );
});

test('product energy CTA uses central model slug and selected power', () => {
  assert.equal(
    buildEnergyCalculatorHref('/ile-pradu-zuzywa-klimatyzacja', 'gree-pular', 4.6),
    '/ile-pradu-zuzywa-klimatyzacja/?model=gree-pular&power=4.6'
  );
  assert.equal(
    buildEnergyCalculatorHref('/ile-pradu-zuzywa-klimatyzacja/', 'kaisai-nordic', 3.5),
    '/ile-pradu-zuzywa-klimatyzacja/?model=kaisai-nordic&power=3.5'
  );
  assert.equal(
    buildEnergyCalculatorLabel('Gree', 'Pular PRO', '3,5'),
    'Sprawdź zużycie energii dla Gree Pular PRO 3,5 kW'
  );
});

test('every Kaisai series has data for a dedicated product page without invented prices', () => {
  assert.deepEqual(
    KAISAI_MODELS.map((model) => model.product.slug),
    ['air', 'fly-plus', 'geo-plus', 'art', 'evo', 'pro-heat-plus', 'nordic', 'ice']
  );
  for (const model of KAISAI_MODELS) {
    assert.ok(model.product.description.length > 80);
    assert.ok(model.product.recommendedFor.length >= 3);
    assert.equal(model.product.priceFromPLN, undefined);
    assert.ok(model.connectivityLabel);
  }
});

test('product page updates energy CTA when the selected variant changes', async () => {
  const page = await readFile(new URL('../src/components/AirConditionerProductPage.astro', import.meta.url), 'utf8');
  assert.match(page, /data-energy-model=\{model\.slug\}/);
  assert.match(page, /updateEnergyCta\(button\)/);
  assert.match(page, /button\.dataset\.powerLabel/);
});

test('UI mode switch updates state without reloading the page', async () => {
  const page = await readFile(new URL('../src/pages/ile-pradu-zuzywa-klimatyzacja.astro', import.meta.url), 'utf8');
  assert.match(page, /changeCalculatorMode\(state, target\.value\)/);
  assert.match(page, /window\.history\.replaceState/);
  assert.doesNotMatch(page, /location\.reload|location\.assign/);
});

test('UI builds a fresh model list for the selected brand without disabled options', async () => {
  const page = await readFile(new URL('../src/pages/ile-pradu-zuzywa-klimatyzacja.astro', import.meta.url), 'utf8');
  assert.match(page, /ENERGY_MODELS\.filter\(\(model\) => model\.brand === state\.selectedBrand\)/);
  assert.match(page, /modelSelect\.replaceChildren\(placeholder\)/);
  assert.doesNotMatch(page, /option\.disabled/);
});

test('energy form accepts small rooms and marks choice groups as required', async () => {
  const page = await readFile(new URL('../src/pages/ile-pradu-zuzywa-klimatyzacja.astro', import.meta.url), 'utf8');
  const areaInput = page.match(/<input class="energy-input" type="number" id="energy-area"[^>]*>/)?.[0] ?? '';
  assert.ok(areaInput);
  assert.doesNotMatch(areaInput, /\bmin=/);
  assert.doesNotMatch(areaInput, /\bmax=/);
  assert.match(areaInput, /placeholder="np\. 30"/);
  assert.match(page, /areaInput\.valueAsNumber > 0/);
  assert.equal((page.match(/Pole wymagane - wybierz jedną opcję\./g) ?? []).length, 3);
});

test('published copy avoids invented installation volume and historical company data', async () => {
  const article = await readFile(new URL('../src/components/articles/HealthImpactArticle.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(article, /setek montaży/i);
  assert.doesNotMatch(article, /sezon 2025\/2026/i);
  assert.doesNotMatch(article, /zapytania, wyceny i realizacje montaży/i);
});

test('catalog lineups render immediately without waiting for scroll reveal', async () => {
  for (const relativePath of [
    '../src/pages/klimatyzatory-gree.astro',
    '../src/pages/klimatyzatory-kaisai.astro'
  ]) {
    const page = await readFile(new URL(relativePath, import.meta.url), 'utf8');
    assert.match(page, /class="container lineup-container"/);
    assert.doesNotMatch(page, /class="container lineup-container" data-reveal/);
  }
});
