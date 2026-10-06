import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GREE_MODELS, KAISAI_MODELS } from '../src/config/lineups.ts';
import {
  buildVariantSku,
  buildVariantUrl,
  resolveVariantSelection,
  toColorParam,
  toPowerParam
} from '../src/utils/product-variant-url.mjs';

const art = KAISAI_MODELS.find((model) => model.product.slug === 'art');
const pular = GREE_MODELS.find((model) => model.product.slug === 'pular');

test('polish query params preselect an existing power variant', () => {
  const selection = resolveVariantSelection({
    search: '?moc=2.5',
    powers: pular.variants.map((variant) => variant.label)
  });

  assert.equal(selection.power, '2.5');
  assert.equal(selection.color, null);
});

test('power and color params preselect exact Kaisai ART configuration', () => {
  const selection = resolveVariantSelection({
    search: '?moc=3.6&kolor=czarny',
    powers: art.variants.map((variant) => variant.label),
    colors: art.product.colors.map((color) => color.name)
  });
  const variant = art.variants.find((item) => toPowerParam(item.powerKw) === selection.power);
  const color = art.product.colors.find((item) => toColorParam(item.name) === selection.color);
  const price = color.priceTier === 'color' ? variant.colorPriceFromPLN : variant.priceFromPLN;

  assert.equal(selection.power, '3.6');
  assert.equal(selection.color, 'czarny');
  assert.equal(price, 4599);
  assert.equal(color.image, '/photos/modele/kolory/kaisai-art-czarny.webp');
});

test('changing power updates moc without reloading or dropping unrelated params', () => {
  const url = buildVariantUrl(
    'https://frigac.pl/klimatyzatory-gree/pular/?ref=porady&moc=2.5',
    { power: 3.2 }
  );
  const parsed = new URL(url);

  assert.equal(parsed.searchParams.get('moc'), '3.2');
  assert.equal(parsed.searchParams.get('ref'), 'porady');
  assert.equal(parsed.searchParams.has('kolor'), false);
});

test('changing color updates kolor and keeps selected power', () => {
  const url = buildVariantUrl(
    'https://frigac.pl/klimatyzatory-kaisai/art/?moc=3.6&kolor=bialy',
    { power: 3.6, color: 'Czarny', hasColorVariants: true }
  );
  const parsed = new URL(url);

  assert.equal(parsed.searchParams.get('moc'), '3.6');
  assert.equal(parsed.searchParams.get('kolor'), 'czarny');
});

test('invalid query params fall back to default existing selections', () => {
  const selection = resolveVariantSelection({
    search: '?moc=999&kolor=fioletowy',
    powers: art.variants.map((variant) => variant.label),
    colors: art.product.colors.map((color) => color.name)
  });

  assert.equal(selection.power, toPowerParam(art.variants[0].powerKw));
  assert.equal(selection.color, toColorParam(art.product.colors[0].name));
});

test('values and internal SKU are normalized deterministically', () => {
  assert.equal(toPowerParam('3,60'), '3.6');
  assert.equal(toPowerParam('7,0'), '7.0');
  assert.equal(toColorParam('Beżowy kamień'), 'bezowy-kamien');
  assert.equal(buildVariantSku({
    brand: 'Kaisai',
    series: 'geo-plus',
    power: 3.5,
    color: 'Szary'
  }), 'FRIGAC-KAISAI-GEOPLUS-35-SZARY');
});

test('product page keeps canonical on the base series URL', async () => {
  const component = await readFile(
    new URL('../src/components/AirConditionerProductPage.astro', import.meta.url),
    'utf8'
  );

  assert.match(component, /const currentPath = `\$\{categoryPath\}\/\$\{model\.product\.slug\}`;/);
  assert.match(component, /currentPath=\{currentPath\}/);
  assert.doesNotMatch(component, /currentPath=\{[^}]*moc/);
});
