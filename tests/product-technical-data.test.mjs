import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GREE_MODELS, KAISAI_MODELS, KAISAI_UNAVAILABLE_MODELS } from '../src/config/lineups.ts';
import { TECHNICAL_FIELDS, readPath } from '../src/config/product-technical.ts';
import { resolveTechnicalData, resolveTechnicalSources } from '../src/utils/product-technical.ts';

const models = [...GREE_MODELS, ...KAISAI_MODELS, ...KAISAI_UNAVAILABLE_MODELS];
const withoutAdditions = (value) => Array.isArray(value)
  ? value.map(withoutAdditions)
  : value !== null && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).filter(([key]) => !['technicalData', 'technicalDataSources', 'technicalDataConflicts'].includes(key)).map(([key, child]) => [key, withoutAdditions(child)]))
    : value;

test('all original public catalog values remain exactly as audited before the research', async () => {
  const baseline = JSON.parse(await readFile(new URL('../docs/product-research/catalog-before.json', import.meta.url), 'utf8'));
  assert.deepEqual(JSON.parse(JSON.stringify(withoutAdditions(models))), baseline);
});

test('resolver exposes every technical field with explicit null for missing data', () => {
  const model = {
    name: 'Example', slug: 'example', image: '/example.webp', alt: 'Example', features: [], tagline: '',
    noise: 'od 18 dB(A)', energyClass: 'A+++ / A++', variants: []
  };
  const variant = { powerKw: 3.5, label: '3,5', coolingCapacityKw: 3.51, heatingCapacityKw: 3.81, seer: 7.1, scop: 4.1 };
  const result = resolveTechnicalData(model, variant);
  for (const [path] of TECHNICAL_FIELDS) {
    const value = path.split('.').reduce((node, key) => node?.[key], result);
    assert.notEqual(value, undefined, `${path}: explicit null or value`);
  }
  assert.equal(result.indoorNoise.minDb, null, 'series-level noise is not a per-power measurement');
  assert.equal(result.coolingEnergyClass, null, 'series classes are not a per-power class');
  assert.equal(result.heatingFeatures.trayHeater, null, 'unknown feature is not false');
  assert.equal(result.priceFromPLN, null);
  assert.equal(result.coolingCapacityKw, variant.coolingCapacityKw);
});

test('variant overrides shared additions while legacy facts, colors and prices stay authoritative', () => {
  const white = { name: 'Biały', image: '/white.webp', alt: 'White', swatch: '#fff' };
  const black = { name: 'Czarny', image: '/black.webp', alt: 'Black', swatch: '#000', priceTier: 'color' };
  const model = {
    name: 'Example', slug: 'example', image: '/example.webp', alt: 'Example', features: [], tagline: '', variants: [],
    product: { slug: 'example', description: '', recommendedFor: [], priceFromPLN: 999, colors: [white, black] },
    technicalData: { airflow: { silentMode: true }, design: { colors: ['Research color'] } },
    technicalDataSources: { 'airflow.silentMode': { sourceId: 'shared', locator: 'shared feature' } }
  };
  const variant = {
    powerKw: 3.5, label: '3,5', coolingCapacityKw: 3.51, heatingCapacityKw: 3.81, seer: 7.1, scop: 4.1,
    priceFromPLN: 4599, colorPriceFromPLN: 4799,
    technicalData: { airflow: { silentMode: false, fanSpeeds: 7 } },
    technicalDataSources: { 'airflow.silentMode': { sourceId: 'variant', locator: 'variant feature' } }
  };
  const result = resolveTechnicalData(model, variant, black);
  assert.equal(result.airflow.silentMode, false);
  assert.equal(result.airflow.fanSpeeds, 7);
  assert.deepEqual(result.design.colors, ['Biały', 'Czarny']);
  assert.deepEqual(result.productImages, ['/black.webp']);
  assert.equal(result.priceFromPLN, 4799);
  assert.equal(result.colorAffectsPrice, true);
  assert.equal(resolveTechnicalSources(model, variant)['airflow.silentMode'].sourceId, 'variant');
  assert.equal(resolveTechnicalData(model, { ...variant, priceFromPLN: undefined, colorPriceFromPLN: undefined }, black).priceFromPLN, null);
  assert.equal(resolveTechnicalData(model, { ...variant, priceFromPLN: undefined, colorPriceFromPLN: undefined }).priceFromPLN, null);
  assert.throws(() => resolveTechnicalData(model, variant, 'Nieistniejący'), RangeError);
});

test('all added facts have a registered official source and precise field locator', async () => {
  const document = JSON.parse(await readFile(new URL('../src/config/product-sources.json', import.meta.url), 'utf8'));
  const registry = document.sources ?? document;
  for (const model of models) for (const item of [model, ...model.variants]) {
    for (const [path] of TECHNICAL_FIELDS) {
      if (readPath(item.technicalData, path) === null) continue;
      const evidence = item.technicalDataSources?.[path];
      assert.ok(evidence?.sourceId, `${model.slug} ${'powerKw' in item ? item.powerKw : 'shared'} ${path}: sourceId`);
      assert.ok(evidence.locator?.trim(), `${model.slug} ${path}: locator`);
      const source = registry[evidence.sourceId];
      assert.ok(source, `${model.slug} ${path}: source registry ${evidence.sourceId}`);
      assert.equal(new URL(source.url).protocol, 'https:');
      assert.ok(source.title?.trim(), `${evidence.sourceId}: title`);
    }
  }
});

test('numeric technical values are valid and pressure and sound power stay separate', () => {
  const positiveFields = ['coolingCapacityKw', 'heatingCapacityKw', 'seer', 'scop', 'ratedInput.coolingKw', 'ratedInput.heatingKw',
    'modulation.coolingMinKw', 'modulation.coolingMaxKw', 'modulation.heatingMinKw', 'modulation.heatingMaxKw', 'airflow.fanSpeeds', 'priceFromPLN'];
  const nonnegativeFields = ['indoorNoise.minDb', 'indoorNoise.maxDb', 'indoorNoise.soundPowerDb', 'outdoorNoise.soundPressureDb', 'outdoorNoise.soundPowerDb'];
  const ranges = [['indoorNoise.minDb', 'indoorNoise.maxDb'], ['modulation.coolingMinKw', 'modulation.coolingMaxKw'],
    ['modulation.heatingMinKw', 'modulation.heatingMaxKw'], ['operatingRange.coolingMinC', 'operatingRange.coolingMaxC'], ['operatingRange.heatingMinC', 'operatingRange.heatingMaxC']];
  for (const model of models) for (const variant of model.variants) {
    const result = resolveTechnicalData(model, variant);
    const label = `${model.slug}/${variant.powerKw}`;
    for (const path of [...positiveFields, ...nonnegativeFields]) {
      const value = readPath(result, path);
      if (value === null) continue;
      assert.ok(Number.isFinite(value), `${label} ${path}: finite number`);
      assert.ok(positiveFields.includes(path) ? value > 0 : value >= 0, `${label} ${path}: range`);
    }
    for (const [minPath, maxPath] of ranges) {
      const min = readPath(result, minPath), max = readPath(result, maxPath);
      if (min !== null && max !== null) assert.ok(min <= max, `${label} ${minPath} <= ${maxPath}`);
    }
    if (result.indoorNoise.levelsDb !== null) {
      assert.ok(result.indoorNoise.levelsDb.length > 0, `${label}: noise levels`);
      assert.ok(result.indoorNoise.levelsDb.every((value) => Number.isFinite(value) && value >= 0), `${label}: noise level numbers`);
    }
    if (result.design.dimensions !== null) assert.ok(Object.values(result.design.dimensions).every((value) => Number.isFinite(value) && value > 0), `${label}: dimensions`);
    if (result.airflow.fanSpeeds !== null) assert.ok(Number.isInteger(result.airflow.fanSpeeds), `${label}: fan speeds`);
    for (const path of ['outdoorNoise.soundPressureDb', 'outdoorNoise.soundPowerDb', 'indoorNoise.soundPowerDb']) {
      if (readPath(result, path) === null) continue;
      assert.ok(resolveTechnicalSources(model, variant)[path], `${label}: independent ${path} evidence`);
    }
  }
});

test('existing energy calculator receives complete per-power values from central catalog', () => {
  for (const model of models) for (const variant of model.variants) {
    const result = resolveTechnicalData(model, variant);
    for (const path of ['coolingCapacityKw', 'heatingCapacityKw', 'seer', 'scop']) {
      assert.ok(Number.isFinite(variant[path]) && variant[path] > 0, `${model.slug}/${variant.powerKw}/${path}`);
      assert.equal(result[path], variant[path]);
    }
  }
});

test('KAISAI heating efficiency has a documented climate and PRO HEAT+ keeps power-specific acoustic data', () => {
  for (const model of [...KAISAI_MODELS, ...KAISAI_UNAVAILABLE_MODELS]) for (const variant of model.variants) {
    const data = resolveTechnicalData(model, variant);
    assert.equal(data.heatingClimate, 'Sezon umiarkowany', `${model.slug}/${variant.powerKw}`);
    assert.ok(resolveTechnicalSources(model, variant).heatingClimate, `${model.slug}/${variant.powerKw}: climate source`);
  }
  const proHeat = KAISAI_MODELS.find(model => model.slug === 'kaisai-pro-heat-plus');
  assert.deepEqual(proHeat.variants.map(variant => {
    const data = resolveTechnicalData(proHeat, variant);
    assert.ok(resolveTechnicalSources(proHeat, variant)['indoorNoise.soundPowerDb']);
    return [variant.powerKw, data.seer, data.scop, data.indoorNoise.soundPowerDb];
  }), [[2.6, 8.5, 4.6, 54], [3.5, 8.5, 4.7, 54], [5.2, 8.5, 4.6, 57], [7, 8.5, 4.7, 60]]);
});
