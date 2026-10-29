import test from 'node:test';
import assert from 'node:assert/strict';
import { GREE_MODELS, KAISAI_MODELS } from '../src/config/lineups.ts';
import { variantHighlights } from '../src/utils/product-highlights.ts';

test('missing per-power acoustic data is shown as missing on the product page', () => {
  const uCrown = GREE_MODELS.find(model => model.slug === 'gree-u-crown');
  assert.equal(variantHighlights(uCrown, uCrown.variants[1]).noiseLabel, 'Brak danych');
});

test('selected PRO HEAT+ variant uses its own noise, classes and documented SCOP climate', () => {
  const model = KAISAI_MODELS.find(model => model.slug === 'kaisai-pro-heat-plus');
  const facts = variantHighlights(model, model.variants[1]);
  assert.equal(facts.noiseLabel, '19 dB(A)');
  assert.equal(facts.classLabel, 'A+++ / A++');
  assert.equal(facts.heatingClimate, 'Sezon umiarkowany');
});
