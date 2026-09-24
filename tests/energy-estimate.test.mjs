import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEnergyEstimate as calculate,
  calculateHeatingEstimate as calculateHeating,
  formatEnergyNumber
} from '../src/utils/energy-estimate.mjs';
const defaults = { power: 3.5, seer: 6.5, price: 1.2, usage: 'standard' };
for (const [power, seer, expected, rounded] of [[3.5,8.5,144.11764705882354,'144'],[3.5,6.5,188.46153846153845,'188'],[5,6.5,269.2307692307692,'269'],[2.5,8,109.375,'109']]) {
  test(`${power} kW / SEER ${seer}`, () => {
    const result = calculate({...defaults, power, seer});
    assert.ok(Math.abs(result.referenceKwh - expected) < 1e-9);
    assert.equal(formatEnergyNumber(result.referenceKwh), rounded);
    assert.equal(result.seasonCost, result.referenceKwh * 1.2);
  });
}
test('usage ranges do not alter the reference result', () => {
  for (const [usage, min, max] of [['occasional',.6,.9],['standard',.9,1.3],['intensive',1.3,2]]) {
    const result = calculate({...defaults, usage});
    assert.deepEqual(result.usageKwh, [result.referenceKwh * min, result.referenceKwh * max]);
    assert.deepEqual(result.usageCost, result.usageKwh.map(v => v * defaults.price));
    assert.equal(formatEnergyNumber(result.seasonCost), '226');
  }
});
test('zero price is accepted', () => {
  assert.equal(calculate({...defaults,price:0}).seasonCost,0);
});
test('invalid input is rejected instead of silently replaced by defaults', () => {
  for (const patch of [{power:0},{power:NaN},{seer:0},{seer:NaN},{seer:Infinity},{price:-1},{price:NaN},{usage:'unknown'}]) {
    assert.throws(() => calculate({...defaults,...patch}), RangeError);
  }
});

const heatingCases = {
  mild: calculateHeating({ area: 20, height: 'low', insulation: 'good', winter: 'mild', scop: 5, price: 1.2 }),
  standard: calculateHeating({ area: 35, height: 'low', insulation: 'standard', winter: 'standard', scop: 4.6, price: 1.2 }),
  demanding: calculateHeating({ area: 50, height: 'high', insulation: 'poor', winter: 'cold', scop: 4, price: 1.2 })
};

test('heating examples return honest ranges and individual-selection warning', () => {
  assert.deepEqual(heatingCases.mild.electricityKwh.map(Math.round), [101, 229]);
  assert.deepEqual(heatingCases.standard.electricityKwh.map(Math.round), [377, 791]);
  assert.deepEqual(heatingCases.demanding.electricityKwh.map(Math.round), [1385, 3000]);
  assert.equal(heatingCases.mild.requiresIndividualSelection, false);
  assert.equal(heatingCases.demanding.requiresIndividualSelection, true);
});

test('heating estimate preserves expected physical relationships', () => {
  const base = { area: 35, height: 'low', insulation: 'standard', winter: 'standard', scop: 4.6, price: 1.2 };
  const energy = (patch = {}) => calculateHeating({ ...base, ...patch }).electricityKwh[1];
  assert.ok(energy({ insulation: 'poor' }) > energy());
  assert.ok(energy({ area: 50 }) > energy());
  assert.ok(energy({ winter: 'cold' }) > energy());
  assert.ok(energy({ scop: 5.5 }) < energy());
  assert.ok(energy({ height: 'high' }) > energy());
});

test('invalid heating input is rejected', () => {
  for (const patch of [{ area: 0 }, { scop: 0 }, { price: -1 }, { height: 'unknown' }, { insulation: 'unknown' }, { winter: 'unknown' }]) {
    assert.throws(() => calculateHeating({ area: 35, height: 'low', insulation: 'standard', winter: 'standard', scop: 4.6, price: 1.2, ...patch }), RangeError);
  }
});
