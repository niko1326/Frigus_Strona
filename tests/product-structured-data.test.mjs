import test from 'node:test';
import assert from 'node:assert/strict';
import { GREE_MODELS, KAISAI_MODELS } from '../src/config/lineups.ts';
import { buildProductStructuredData } from '../src/utils/product-structured-data.ts';

const allModels = [
  ...GREE_MODELS.map((model) => ({ brand: 'Gree', model })),
  ...KAISAI_MODELS.map((model) => ({ brand: 'Kaisai', model }))
];

const schemaFor = (brand, model) => buildProductStructuredData({
  brand,
  category: model.slug === 'kaisai-konsola'
    ? 'Klimatyzator konsolowy split z montażem'
    : 'Klimatyzator ścienny split z montażem',
  model,
  pageUrl: `https://frigac.pl/${brand === 'Gree' ? 'klimatyzatory-gree' : 'klimatyzatory-kaisai'}/${model.product.slug}/`
});

const productsFrom = (schema) => schema['@type'] === 'ProductGroup'
  ? schema.hasVariant
  : [schema];

test('every structured Product has one exact PLN Offer from central variant data', () => {
  for (const { brand, model } of allModels) {
    const schema = schemaFor(brand, model);
    const allowedPrices = new Set(model.variants.flatMap((variant) => [
      variant.priceFromPLN,
      variant.colorPriceFromPLN
    ].filter((price) => typeof price === 'number')));

    for (const product of productsFrom(schema)) {
      assert.equal(product['@type'], 'Product');
      assert.equal(product.offers['@type'], 'Offer');
      assert.equal(product.offers.priceCurrency, 'PLN');
      assert.ok(allowedPrices.has(product.offers.price));
      assert.match(product.sku, /^FRIGAC-[A-Z0-9-]+$/);
      assert.equal(product.url, product.offers.url);
      assert.ok(new URL(product.offers.url).searchParams.has('moc'));
      assert.equal(
        new URL(product.offers.url).searchParams.has('kolor'),
        (model.product.colors?.length ?? 0) > 1
      );
      assert.match(product.offers.description, /urządzenie i standardowy montaż do 3 mb/i);
      assert.ok(product.additionalProperty.some((property) => property.name === 'Moc chłodnicza'));
      assert.ok(product.additionalProperty.some((property) => property.name === 'Moc grzewcza'));
      assert.ok(!('availability' in product.offers));
      assert.ok(!('shippingDetails' in product.offers));
    }
  }
});

test('every power and color combination keeps its exact central price', () => {
  for (const { brand, model } of allModels) {
    const products = productsFrom(schemaFor(brand, model));
    const seriesName = model.product.ctaName ?? model.name;
    const colors = model.product.colors ?? [];
    const expected = model.variants.flatMap((variant) => {
      const colorVariants = colors.length > 0 ? colors : [undefined];
      return colorVariants.flatMap((color) => {
        const price = color?.priceTier === 'color'
          ? variant.colorPriceFromPLN
          : variant.priceFromPLN;
        if (typeof price !== 'number') return [];

        return [{
          name: `${brand} ${seriesName} ${variant.label} kW${color ? ` ${color.name}` : ''}`,
          color: color?.name,
          price
        }];
      });
    });

    assert.deepEqual(
      products.map((product) => ({
        name: product.name,
        color: product.color,
        price: product.offers.price
      })),
      expected
    );
  }
});

test('color variants use color-specific prices and omit combinations without a price', () => {
  const art = KAISAI_MODELS.find((model) => model.product.slug === 'art');
  const artProducts = productsFrom(schemaFor('Kaisai', art));
  const blackArt36 = artProducts.find((product) => product.name === 'Kaisai ART 3,6 kW Czarny');
  assert.equal(blackArt36.offers.price, 4599);
  assert.equal(blackArt36.color, 'Czarny');
  assert.equal(blackArt36.sku, 'FRIGAC-KAISAI-ART-36-CZARNY');
  assert.equal(
    blackArt36.offers.url,
    'https://frigac.pl/klimatyzatory-kaisai/art/?moc=3.6&kolor=czarny'
  );

  const ice = KAISAI_MODELS.find((model) => model.product.slug === 'ice');
  const iceProducts = productsFrom(schemaFor('Kaisai', ice));
  assert.equal(iceProducts.length, 6);
  assert.ok(!iceProducts.some((product) => product.name === 'Kaisai ICE 5,3 kW Czarny'));
  assert.ok(!iceProducts.some((product) => product.name === 'Kaisai ICE 7,0 kW Czarny'));
});

test('power is a technical property and only color uses Google-supported variesBy', () => {
  for (const { brand, model } of allModels) {
    const schema = schemaFor(brand, model);
    if (schema['@type'] !== 'ProductGroup') continue;

    if ((model.product.colors?.length ?? 0) > 1) {
      assert.deepEqual(schema.variesBy, ['https://schema.org/color']);
    } else {
      assert.ok(!('variesBy' in schema));
    }
    assert.ok(!JSON.stringify(schema).includes('https://schema.org/size'));
  }
});

test('single Kaisai console remains a Product with an Offer', () => {
  const consoleModel = KAISAI_MODELS.find((model) => model.product.slug === 'konsola');
  const schema = schemaFor('Kaisai', consoleModel);
  assert.equal(schema['@type'], 'Product');
  assert.equal(schema.name, 'Kaisai Konsola 3,5 kW');
  assert.equal(schema.offers.price, 4399);
  assert.equal(schema.sku, 'FRIGAC-KAISAI-KONSOLA-35');
  assert.equal(schema.offers.url, 'https://frigac.pl/klimatyzatory-kaisai/konsola/?moc=3.5');
});

test('catalog emits 16 ProductGroups and 116 uniquely identified priced Products', () => {
  const schemas = allModels.map(({ brand, model }) => schemaFor(brand, model));
  const products = schemas.flatMap(productsFrom);

  assert.equal(schemas.filter((schema) => schema['@type'] === 'ProductGroup').length, 16);
  assert.equal(products.length, 116);
  assert.equal(new Set(products.map((product) => product['@id'])).size, products.length);
  assert.equal(new Set(products.map((product) => product.sku)).size, products.length);
  assert.ok(products.every((product) => product.offers));
});

test('ProductGroup keeps the base series URL while variants use direct query URLs', () => {
  for (const { brand, model } of allModels) {
    const schema = schemaFor(brand, model);
    if (schema['@type'] !== 'ProductGroup') continue;

    assert.equal(new URL(schema.url).search, '');
    assert.ok(schema.hasVariant.every((product) => new URL(product.url).searchParams.has('moc')));
  }
});
