import test from 'node:test';
import assert from 'node:assert/strict';
import { ENERGY_MODELS } from '../src/config/lineups.ts';
import { TECHNICAL_FIELDS } from '../src/config/product-technical.ts';
import { OFFER_PRIORITIES, DEFAULT_OFFER_PRIORITY, normalizeOfferPriorities, getOfferPriorityFields } from '../src/config/offer-priorities.ts';
import { resolveOfferSelection, resolveOfferItems, calculateOfferComparisons, calculateOfferEnergy } from '../src/utils/offers.ts';
import { calculateEnergyEstimate, calculateHeatingEstimate } from '../src/utils/energy-estimate.mjs';

const clivia = () => resolveOfferSelection({ modelSlug: 'gree-clivia', powerKw: 3.5, colorName: 'Biały' });
const airy = () => resolveOfferSelection({ modelSlug: 'gree-airy', powerKw: 3.5, colorName: 'Biały' });
const energyInput = { area: 25, price: 1.1, insulation: 'standard', coolingUsage: 'standard', heatingUsage: 'regular' };
const metric = (items, name) => calculateOfferComparisons(items).find((entry) => entry.metric === name);

test('all 11 priorities map only to central field paths; blank choice is a general offer', () => {
  assert.equal(OFFER_PRIORITIES.length, 11);
  assert.equal(DEFAULT_OFFER_PRIORITY, 'general');
  assert.equal(new Set(OFFER_PRIORITIES.map((entry) => entry.id)).size, 11);
  const allowed = new Set(TECHNICAL_FIELDS.map(([path]) => path));
  assert.ok(OFFER_PRIORITIES.every((entry) => entry.fields.every((path) => allowed.has(path))));
  assert.deepEqual(normalizeOfferPriorities(), { main: 'general', additional: [] });
  assert.deepEqual(normalizeOfferPriorities('unknown', null), { main: 'general', additional: [] });
  assert.deepEqual(normalizeOfferPriorities('quiet', ['quiet', 'design', 'design', 'heating', 'invalid']), { main: 'quiet', additional: ['design', 'heating'] });
  const ordered = getOfferPriorityFields({ main: 'quiet', additional: ['design'] });
  assert.equal(ordered[0], 'indoorNoise.minDb');
  assert.ok(ordered.includes('productImages'));
  assert.equal(new Set(ordered).size, ordered.length);
});

test('selection resolves exact central variant/color price and assigned photo without storing a separate catalog', () => {
  const choice = { modelSlug: 'gree-airy', powerKw: 3.5, colorName: 'Ciemny', price: 1, image: '/fake.webp' };
  const selected = resolveOfferSelection(choice);
  const central = ENERGY_MODELS.find((entry) => entry.slug === choice.modelSlug);
  assert.strictEqual(selected.model, central);
  assert.strictEqual(selected.variant, central.variants.find((entry) => entry.powerKw === choice.powerKw));
  assert.equal(selected.price, selected.variant.colorPriceFromPLN);
  assert.equal(selected.image, central.product.colors.find((entry) => entry.name === choice.colorName).image);
  assert.equal(selected.technicalData.priceFromPLN, selected.price);
  assert.deepEqual(selected.technicalData.productImages, [selected.image]);
  assert.ok(selected.id.includes('Ciemny'));
  const base = resolveOfferSelection({ modelSlug: 'gree-pular', powerKw: 3.2 });
  assert.equal(base.color, null);
  assert.equal(base.price, base.variant.priceFromPLN);
  assert.equal(base.image, base.model.image);
});

test('default colors use the base price and retain exact color adjustments for the selected power', () => {
  const item = resolveOfferSelection({ modelSlug: 'gree-airy', powerKw: 3.5 });
  assert.equal(item.defaultColors, true);
  assert.equal(item.color, null);
  assert.equal(item.price, 5099);
  assert.match(item.image, /bialy/);
  assert.equal(item.colorPrices.find(color => color.name === 'Ciemny').difference, 100);
  assert.equal(resolveOfferSelection({ modelSlug: 'gree-airy', powerKw: 2.7 }).colorPrices.find(color => color.name === 'Ciemny').difference, 200);
  assert.ok(resolveOfferSelection({ modelSlug: 'gree-clivia', powerKw: 3.5 }).colorPrices.every(color => color.difference === 0));
  assert.equal(resolveOfferSelection({ modelSlug: 'kaisai-art', powerKw: 7 }).colorPrices.find(color => color.name === 'Czarny').difference, -200);
  assert.notEqual(item.id, airy().id);
  assert.equal(airy().defaultColors, false);
});

test('an unknown color price stays unknown in default mode and cannot be quoted as an exact variant', () => {
  const item = resolveOfferSelection({ modelSlug: 'kaisai-ice', powerKw: 5.3 });
  assert.equal(item.price, 5199);
  assert.deepEqual(item.colorPrices.find(color => color.name === 'Czarny'), { name: 'Czarny', price: null, difference: null });
  assert.throws(() => resolveOfferSelection({ modelSlug: 'kaisai-ice', powerKw: 5.3, colorName: 'Czarny' }), /Brak aktualnej ceny/);
});

test('invalid, unavailable and unpriced selections are rejected', () => {
  for (const selection of [
    null,
    { modelSlug: 'not-a-product', powerKw: 3.5 },
    { modelSlug: 'kaisai-nordic', powerKw: 3.5 },
    { modelSlug: 'gree-pular', powerKw: 999 },
    { modelSlug: 'gree-pular', powerKw: '3.2' },
    { modelSlug: 'gree-u-crown', powerKw: 3.5 },
    { modelSlug: 'gree-airy', powerKw: 3.5, colorName: 'Czerwony' },
    { modelSlug: 'kaisai-ice', powerKw: 5.3, colorName: 'Czarny' }
  ]) assert.throws(() => resolveOfferSelection(selection), RangeError);
});

test('offer limits are enforced and duplicate exact variants cannot inflate the comparison', () => {
  const one = { modelSlug: 'gree-pular', powerKw: 3.2 };
  assert.equal(resolveOfferItems([one]).length, 1);
  assert.throws(() => resolveOfferItems([]), RangeError);
  assert.throws(() => resolveOfferItems([one, one]), /więcej niż raz/);
  assert.throws(() => resolveOfferItems(Array.from({ length: 9 }, () => one)), /od 1 do 8/);
  const eight = [
    ...[2.5, 3.2, 4.6, 6.2].map((powerKw) => ({ modelSlug: 'gree-pular', powerKw })),
    ...[2.7, 3.5, 5.1, 7.1].map((powerKw) => ({ modelSlug: 'gree-cosmo-pearl', powerKw }))
  ];
  assert.equal(resolveOfferItems(eight).length, 8);
});

test('comparisons concern only selected items, preserve ties and never create a global claim', () => {
  const first = clivia();
  const second = airy();
  const result = calculateOfferComparisons([first, second]);
  assert.equal(metric([first, second], 'scop').value, Math.max(first.technicalData.scop, second.technicalData.scop));
  assert.deepEqual(metric([first, second], 'colors').winnerIds, [first.id]);
  assert.equal(metric([first, second], 'price').value, Math.min(first.price, second.price));
  const noise = metric([first, second], 'noise');
  assert.equal(noise.value, 19);
  assert.deepEqual(noise.winnerIds, [first.id, second.id]);
  assert.match(noise.label, /Wspólnie/);
  assert.ok(result.every((entry) => /wybran/.test(entry.label)));
  assert.deepEqual(calculateOfferComparisons([first]), []);
  assert.deepEqual(calculateOfferComparisons([]), []);
});

test('one missing or conflicted value suppresses that metric for the entire selected set', () => {
  const first = clivia();
  const second = airy();
  const missingNoise = { ...second, technicalData: { ...second.technicalData, indoorNoise: { ...second.technicalData.indoorNoise, minDb: null } } };
  assert.equal(metric([first, missingNoise], 'noise'), undefined);
  assert.ok(metric([first, missingNoise], 'price'));
  assert.equal(metric([first, { ...second, conflictPaths: ['scop'] }], 'scop'), undefined);
  assert.equal(metric([first, { ...second, conflictPaths: ['technicalData.indoorNoise'] }], 'noise'), undefined);
  const unknownColors = resolveOfferSelection({ modelSlug: 'gree-cosmo-pearl', powerKw: 3.5 });
  assert.equal(metric([first, unknownColors], 'colors'), undefined, 'one generic image does not prove one official color');
});

test('price ties retain every winner and unknown prices cannot produce a comparison', () => {
  const first = clivia();
  const second = airy();
  const tied = { ...second, price: first.price };
  assert.deepEqual(metric([first, tied], 'price').winnerIds, [first.id, second.id]);
  assert.match(metric([first, tied], 'price').label, /Wspólnie/);
  assert.equal(metric([first, { ...second, price: null }], 'price'), undefined);
});

test('energy output exactly reuses both existing calculator functions and explicit shared inputs', () => {
  const item = clivia();
  const result = calculateOfferEnergy(item, energyInput);
  const data = item.technicalData;
  assert.deepEqual(result.cooling, calculateEnergyEstimate({ power: data.coolingCapacityKw, seer: data.seer, area: energyInput.area, price: energyInput.price, usage: energyInput.coolingUsage, insulation: energyInput.insulation }));
  assert.deepEqual(result.heating, calculateHeatingEstimate({ heatingCapacityKw: data.heatingCapacityKw, scop: data.scop, area: energyInput.area, price: energyInput.price, usage: energyInput.heatingUsage, insulation: energyInput.insulation }));
  assert.ok(result.notes.length > 0);
  assert.deepEqual(result.conflictPaths, []);
  assert.throws(() => calculateOfferEnergy(item, { ...energyInput, area: 0 }), RangeError);
  assert.throws(() => calculateOfferEnergy(item, { ...energyInput, price: -1 }), RangeError);
  assert.throws(() => calculateOfferEnergy(item, { ...energyInput, coolingUsage: 'invalid' }), RangeError);
});

test('cost calculations skip disputed inputs, retain other-mode output and flag insufficient power', () => {
  const item = clivia();
  const disputed = calculateOfferEnergy({ ...item, conflictPaths: ['scop'] }, energyInput);
  assert.ok(disputed.cooling);
  assert.equal(disputed.heating, null);
  assert.ok(disputed.warnings.some((warning) => /konflikt danych scop/.test(warning)));
  const missing = calculateOfferEnergy({ ...item, technicalData: { ...item.technicalData, seer: null } }, energyInput);
  assert.equal(missing.cooling, null);
  assert.ok(missing.heating);
  const insufficient = calculateOfferEnergy(item, { ...energyInput, area: 150, insulation: 'poor' });
  assert.equal(insufficient.heating.requiresIndividualSelection, true);
  assert.ok(insufficient.warnings.some((warning) => /indywidualnego doboru/.test(warning)));
  const realConflict = resolveOfferSelection({ modelSlug: 'gree-g-time', powerKw: 2.7 });
  const skipped = calculateOfferEnergy(realConflict, energyInput);
  assert.equal(skipped.cooling, null);
  assert.equal(skipped.heating, null);
});
