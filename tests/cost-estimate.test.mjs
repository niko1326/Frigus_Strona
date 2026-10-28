import test from 'node:test';
import assert from 'node:assert/strict';
import { COST_CALCULATOR_CONFIG, calculateCostEstimate } from '../src/config/costCalculator.ts';
import { createCostCalculator } from '../src/utils/cost-estimate.ts';

test('public cost estimator keeps existing results after its config crosses the JSON boundary', () => {
  const browserConfig = JSON.parse(JSON.stringify(COST_CALCULATOR_CONFIG));
  const calculator = createCostCalculator(browserConfig);
  const cases = [
    [{ areas: [20], priority: 'price', installationMeters: 3 }, { low: 3400, high: 4500 }],
    [{ areas: [30, 45], priority: 'comfort', installationMeters: 7 }, { low: 9200, high: 14000 }],
    [{ areas: [60, 20, 30], priority: 'heating', installationMeters: 15 }, { low: 13650, high: 21700 }]
  ];
  for (const [input, expectedRange] of cases) {
    const estimate = calculator.calculateCostEstimate(input);
    assert.equal(estimate.kind, 'range');
    assert.deepEqual(estimate.range, expectedRange);
    assert.deepEqual(estimate, calculateCostEstimate(input));
  }
  assert.deepEqual(calculator.calculateCostEstimate({ areas: [80], priority: 'heating', installationMeters: 5 }), {
    kind: 'individual', rooms: [{ area: 80, powerKw: null }], installationMeters: 5
  });
  assert.equal(calculator.getRoomEstimate(30).price.low, 3499);
  assert.equal(calculator.getRoomEstimate(71), null);
});
