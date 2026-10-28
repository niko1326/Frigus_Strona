import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateOfferRoom, recommendOffer } from '../src/utils/offer-recommendations.ts';

const room = { area: 25, height: 2.6, sloped: false, minHeight: 1, slopePercent: 100, sun: 'standard', location: 'middle', glazing: 'no', insulation: 'standard', occupants: 2, equipmentW: 0, layout: 'open', count: 3, requireUvc: false, maxPrice: null };
const priorities = { main: 'general', additional: [] };

test('volume includes flat and sloped portions without applying a second height correction', () => {
  assert.equal(estimateOfferRoom(room).volume, 65);
  assert.equal(estimateOfferRoom(room).needKw, 2.6);
  const sloped = estimateOfferRoom({ ...room, area: 30, height: 3, minHeight: 1, slopePercent: 50, sloped: true });
  assert.equal(sloped.averageHeight, 2.5);
  assert.equal(sloped.volume, 75);
  assert.equal(sloped.needKw, 3);
  assert.equal(estimateOfferRoom({ ...room, area: 30, height: 3, minHeight: 1, slopePercent: 100, sloped: true }).volume, 60);
  assert.throws(() => estimateOfferRoom({ ...room, sloped: true, minHeight: 4 }), /wysokość minimalną/);
  assert.throws(() => estimateOfferRoom({ ...room, sloped: true, slopePercent: 0 }), /udział skosów/);
});

test('heat gains increase the cooling target and number of alternatives never divides it', () => {
  const standard = estimateOfferRoom(room);
  for (const changes of [{ height: 3.2 }, { sun: 'high' }, { location: 'top' }, { glazing: 'yes' }, { insulation: 'poor' }, { occupants: 4 }, { equipmentW: 500 }]) {
    assert.ok(estimateOfferRoom({ ...room, ...changes }).needKw > standard.needKw);
  }
  assert.equal(estimateOfferRoom({ ...room, count: 8 }).needKw, standard.needKw);
  assert.equal(estimateOfferRoom({ ...room, occupants: 4 }).peopleKw, 0.36);
  assert.equal(estimateOfferRoom({ ...room, equipmentW: 500 }).equipmentKw, 0.5);
});

test('recommendations cover the load, use distinct series and enforce hard filters', () => {
  const result = recommendOffer({ ...room, count: 8, requireUvc: true, maxPrice: 4500 }, { main: 'air-quality', additional: ['quiet'] });
  assert.ok(result.items.length > 0 && result.items.length < 8);
  assert.equal(new Set(result.items.map(item => item.model.slug)).size, result.items.length);
  assert.ok(result.items.every(item => item.technicalData.airQuality.uvc === true && item.price <= 4500 && item.variant.coolingCapacityKw >= result.estimate.needKw));
  assert.match(result.warnings.join(' '), /Znaleziono/);
  for (const item of result.items) assert.ok(item.model.variants.every(variant => !(variant.coolingCapacityKw >= result.estimate.needKw && variant.coolingCapacityKw < item.variant.coolingCapacityKw)));
});

test('selected needs affect ranking: air quality prioritizes verified UVC, price orders by actual base price', () => {
  const quality = recommendOffer(room, { main: 'air-quality', additional: [] });
  assert.ok(quality.items.every(item => item.technicalData.airQuality.uvc === true));
  const prices = recommendOffer({ ...room, count: 8 }, { main: 'price', additional: [] }).items.map(item => item.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  const heating = recommendOffer(room, { main: 'heating', additional: [] });
  assert.match(heating.warnings.join(' '), /Moc dobrano do chłodzenia/);
});

test('no fit, uncertain nominal capacity and unsuitable room configurations do not silently produce substitutes', () => {
  for (const changes of [{ layout: 'separate' }, { area: 71 }, { height: 5 }, { equipmentW: 9000 }, { maxPrice: 100 }, { count: 0 }, { area: NaN }, { occupants: 2.5 }, { insulation: 'unknown' }]) {
    assert.throws(() => recommendOffer({ ...room, ...changes }, priorities), RangeError);
  }
  const result = recommendOffer({ ...room, area: 31, count: 8 }, priorities);
  assert.ok(result.items.every(item => !item.conflictPaths.includes('coolingCapacityKw')));
});

test('both brands are represented when requested, without bypassing capacity, UVC or budget filters', () => {
  const both = recommendOffer({ ...room, count: 2, requireUvc: true }, { main: 'air-quality', additional: [] });
  assert.ok(both.items.some(item => item.model.slug.startsWith('gree-')));
  assert.ok(both.items.some(item => item.model.slug.startsWith('kaisai-')));
  assert.ok(both.items.every(item => item.technicalData.airQuality.uvc === true));
  for (const brand of ['gree', 'kaisai']) {
    const result = recommendOffer({ ...room, brand, requireUvc: true, count: 8 }, priorities);
    assert.ok(result.items.length > 0);
    assert.ok(result.items.every(item => item.model.slug.startsWith(brand + '-')));
  }
  const limited = recommendOffer({ ...room, count: 2, requireUvc: true, maxPrice: 4000 }, priorities);
  assert.ok(limited.items.every(item => item.price <= 4000 && item.technicalData.airQuality.uvc === true));
  assert.match(limited.warnings.join(' '), /GREE: brak modelu/);
  assert.throws(() => recommendOffer({ ...room, brand: 'gree', requireUvc: true, maxPrice: 4000 }, priorities), /Brak modeli/);
});
