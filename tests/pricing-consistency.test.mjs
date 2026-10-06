import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { COST_CALCULATOR_CONFIG, getRoomEstimate } from '../src/config/costCalculator.ts';
import { GREE_MODELS, KAISAI_MODELS } from '../src/config/lineups.ts';
import { PRICING } from '../src/config/site.ts';

test('starting price is tied to the two exact entry variants and three-metre installation', () => {
  const pular = GREE_MODELS.find((model) => model.product.slug === 'pular');
  const air = KAISAI_MODELS.find((model) => model.product.slug === 'air');

  assert.equal(PRICING.installFromPLN, 3399);
  assert.equal(PRICING.standardInstallationMeters, 3);
  assert.equal(pular.variants.find((variant) => variant.powerKw === 2.5).priceFromPLN, 3399);
  assert.equal(air.variants.find((variant) => variant.powerKw === 2.6).priceFromPLN, 3399);
  assert.match(PRICING.startingPriceModels, /Gree Pular 2,5 kW/);
  assert.match(PRICING.startingPriceModels, /Kaisai AIR \(KKWK\) 2,6 kW/);
  assert.match(PRICING.startingPriceModels, / oraz /);
  assert.equal(PRICING.startingPriceAnchor, 'cena-3399');
  assert.equal(PRICING.startingPriceDetailsHref, '/cennik#cena-3399');
  assert.equal(PRICING.startingPriceLinkLabel, 'Sprawdź, czego dotyczy cena 3399 zł →');
  assert.match(PRICING.startingPriceDetails, /standardowym montażem do 3 mb/);
});

test('cost calculator does not assign the 3399 zł entry price to higher power bands', () => {
  assert.equal(getRoomEstimate(20).price.low, 3399);
  assert.equal(getRoomEstimate(30).price.low, 3499);
  assert.equal(getRoomEstimate(45).price.low, 4399);
  assert.equal(getRoomEstimate(60).price.low, 5199);
  assert.deepEqual(
    COST_CALCULATOR_CONFIG.powerBands.map((band) => band.price.low),
    [3399, 3499, 4399, 5199]
  );
});

test('published pricing copy avoids stale speed promises and unrestricted extra-cost claims', async () => {
  const files = [
    '../src/i18n/content.ts',
    '../src/pages/bydgoszcz.astro',
    '../src/pages/cennik.astro',
    '../src/pages/faq.astro',
    '../src/pages/kontakt.astro',
    '../src/pages/narzedzia.astro',
    '../src/pages/trojmiasto.astro'
  ];
  const copy = (await Promise.all(files.map((file) => readFile(new URL(file, import.meta.url), 'utf8')))).join('\n');

  assert.doesNotMatch(copy, /wycena telefoniczna w kilka minut/i);
  assert.doesNotMatch(copy, /dokładną cenę podajemy telefonicznie/i);
  assert.doesNotMatch(copy, /bez dodatkowych kosztów/i);
  assert.match(copy, /Finalny zakres i cenę/);
});

test('main price note is sourced from central pricing configuration', async () => {
  const pricingPage = await readFile(new URL('../src/pages/cennik.astro', import.meta.url), 'utf8');
  assert.match(pricingPage, /id=\{PRICING\.startingPriceAnchor\}/);
  assert.match(pricingPage, /PRICING\.startingPriceDetails/);
  assert.match(pricingPage, /PRICING\.standardInstallationMeters/);
  assert.match(pricingPage, /PRICING\.pricingNote/);
});

test('general 3399 zł messages link to the central price details', async () => {
  const filesUsingDetailsLink = [
    '../src/components/sections/home/HeroSection.astro',
    '../src/components/sections/home/HomeArticleSection.astro',
    '../src/components/sections/home/HomeFaqSection.astro',
    '../src/components/sections/home/PricingTeaser.astro',
    '../src/pages/bydgoszcz.astro',
    '../src/pages/faq.astro',
    '../src/pages/kalkulator-kosztow-klimatyzacji.astro',
    '../src/pages/klimatyzatory-gree.astro',
    '../src/pages/klimatyzatory-kaisai.astro',
    '../src/pages/porady/ile-kosztuje-montaz-klimatyzacji.astro',
    '../src/pages/trojmiasto.astro'
  ];

  for (const file of filesUsingDetailsLink) {
    const copy = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.match(copy, /PRICING\.startingPriceDetailsHref/, `${file} should use the central href`);
    assert.match(copy, /PRICING\.startingPriceLinkLabel/, `${file} should use the central label`);
  }

  const articles = await readFile(new URL('../src/config/articles.ts', import.meta.url), 'utf8');
  assert.match(articles, /priceDetailsHref: PRICING\.startingPriceDetailsHref/);
  const articleList = await readFile(new URL('../src/pages/porady/index.astro', import.meta.url), 'utf8');
  assert.match(articleList, /href=\{article\.priceDetailsHref\}/);
  assert.match(articleList, /PRICING\.startingPriceLinkLabel/);

  const modelCards = await readFile(new URL('../src/components/ModelLineup.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(modelCards, /startingPriceDetailsHref/);

  const socialGenerator = await readFile(new URL('../scripts/export-brand.mjs', import.meta.url), 'utf8');
  assert.match(socialGenerator, /PRICING\.installFromPLN/);
  assert.doesNotMatch(socialGenerator, /startingPriceModels/);
});
