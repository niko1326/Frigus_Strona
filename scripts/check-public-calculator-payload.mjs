import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ENERGY_MODELS } from '../src/config/lineups.ts';
import { COST_CALCULATOR_CONFIG } from '../src/config/costCalculator.ts';
import { createCostCalculator } from '../src/utils/cost-estimate.ts';
import { stateFromQuery } from '../src/utils/energy-calculator-state.mjs';
import { calculateEnergyEstimate, calculateHeatingEstimate } from '../src/utils/energy-estimate.mjs';

// Run after `npm run build`: inspect actual published HTML and every reachable
// JavaScript module, including shared chunks, rather than the source imports.
const output = new URL('../dist/', import.meta.url);
const energyHtml = await readFile(new URL('ile-pradu-zuzywa-klimatyzacja/index.html', output), 'utf8');
const costHtml = await readFile(new URL('kalkulator-kosztow-klimatyzacji/index.html', output), 'utf8');

function jsonData(html, id) {
  const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
    .find(([, attributes]) => new RegExp(`\\bid=["']${id}["']`).test(attributes));
  assert.ok(script, `Missing built JSON payload ${id}; rebuild the website first.`);
  assert.match(script[1], /type=["']application\/json["']/);
  assert.ok(!script[2].includes('<'), `${id}: embedded data must escape HTML delimiters`);
  assert.doesNotMatch(script[2], /technicalData|technicalDataSources|technicalDataConflicts/);
  return JSON.parse(script[2]);
}

const catalog = jsonData(energyHtml, 'energy-catalog');
const projectedCatalog = ENERGY_MODELS.map(({ name, slug, brand, brandLabel, variants }) => ({
  name, slug, brand, brandLabel,
  variants: variants.map(({ label, powerKw, coolingCapacityKw, heatingCapacityKw, seer, scop }) =>
    ({ label, powerKw, coolingCapacityKw, heatingCapacityKw, seer, scop }))
}));
assert.deepEqual(catalog, projectedCatalog, 'Built energy inputs must match the current central catalog exactly.');
assert.ok(JSON.stringify(catalog).length < 20000, 'The public energy projection must stay small.');

for (const model of catalog) for (const variant of model.variants) {
  const central = ENERGY_MODELS.find((entry) => entry.slug === model.slug).variants.find((entry) => entry.powerKw === variant.powerKw);
  for (const mode of ['cooling', 'heating']) {
    const state = stateFromQuery(`?model=${model.slug}&power=${variant.powerKw}&mode=${mode}`, catalog);
    assert.equal(state.selectedModel, model.slug);
    assert.equal(state.selectedBrand, model.brand);
    assert.equal(state.selectedVariant, variant.powerKw);
    assert.equal(state.mode, mode);
  }
  const coolingInput = { area: 35, price: 1.2, usage: 'standard', insulation: 'standard' };
  assert.deepEqual(
    calculateEnergyEstimate({ ...coolingInput, power: variant.coolingCapacityKw, seer: variant.seer }),
    calculateEnergyEstimate({ ...coolingInput, power: central.coolingCapacityKw, seer: central.seer })
  );
  const heatingInput = { area: 35, price: 1.2, usage: 'regular', insulation: 'standard' };
  assert.deepEqual(
    calculateHeatingEstimate({ ...heatingInput, heatingCapacityKw: variant.heatingCapacityKw, scop: variant.scop }),
    calculateHeatingEstimate({ ...heatingInput, heatingCapacityKw: central.heatingCapacityKw, scop: central.scop })
  );
}

const costConfig = jsonData(costHtml, 'cost-calculator-config');
assert.deepEqual(costConfig, COST_CALCULATOR_CONFIG, 'Built cost config must keep central prices and assumptions.');
assert.deepEqual(createCostCalculator(costConfig).calculateCostEstimate({ areas: [30, 45], priority: 'comfort', installationMeters: 7 }).range,
  { low: 9200, high: 14000 });

async function scriptGraph(html, pagePath, payloadId) {
  const pending = [];
  const visited = new Set();
  let bytes = 0;
  let inlineScripts = 0;
  let executableSource = '';
  const pageUrl = new URL(pagePath, output);
  const enqueue = (dependency, baseUrl) => {
    if (dependency.startsWith('.')) pending.push(new URL(dependency, baseUrl));
    else if (dependency.startsWith('/_astro/')) pending.push(new URL(dependency.slice(1), output));
  };
  const inspect = (code, baseUrl) => {
    bytes += Buffer.byteLength(code);
    executableSource += code;
    assert.doesNotMatch(code, /technicalData|technicalDataSources|technicalDataConflicts|gree-rac-2026|PDF spread/,
      `Public calculator imports research metadata through ${baseUrl.pathname}`);
    for (const [, dependency] of code.matchAll(/(?:from\s*|import\s*|import\s*\()\s*["']([^"']+)["']/g)) {
      enqueue(dependency, baseUrl);
    }
  };
  // Astro can inline a small processed module. Validate executable inline
  // bodies as well as external scripts, and follow imports from either form.
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (type && !['module', 'text/javascript', 'application/javascript'].includes(type)) continue;
    const src = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (src) enqueue(src, pageUrl);
    else if (body.trim()) {
      inlineScripts++;
      inspect(body, pageUrl);
    }
  }
  while (pending.length) {
    const url = pending.pop();
    if (visited.has(url.href)) continue;
    visited.add(url.href);
    const code = await readFile(url, 'utf8');
    inspect(code, url);
  }
  assert.ok(executableSource.includes(payloadId), `Expected a built calculator script consuming ${payloadId}.`);
  assert.ok(bytes < 100000, `Public calculator scripts unexpectedly exceed 100 kB (${bytes} bytes).`);
  return { externalModules: visited.size, inlineScripts, bytes };
}

const energyScripts = await scriptGraph(energyHtml, 'ile-pradu-zuzywa-klimatyzacja/index.html', 'energy-catalog');
const costScripts = await scriptGraph(costHtml, 'kalkulator-kosztow-klimatyzacji/index.html', 'cost-calculator-config');
console.log(JSON.stringify({
  energy: { models: catalog.length, variants: catalog.reduce((sum, model) => sum + model.variants.length, 0), jsonBytes: Buffer.byteLength(JSON.stringify(catalog)), ...energyScripts },
  cost: { jsonBytes: Buffer.byteLength(JSON.stringify(costConfig)), ...costScripts },
  verification: 'Built public payloads contain only calculator data; central prices, deep links and both energy modes match.'
}, null, 2));
