import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
import { ENERGY_MODELS } from '../src/config/lineups.ts';

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
