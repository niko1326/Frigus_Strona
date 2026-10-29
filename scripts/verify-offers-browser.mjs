import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolveOfferSelection } from '../src/utils/offers.ts';
import { recommendOffer } from '../src/utils/offer-recommendations.ts';

// Exercise the local Worker with throwaway QA credentials, never production secrets.
const username = process.env.FRIGAC_QA_USERNAME;
const password = process.env.FRIGAC_QA_PASSWORD;
if (!username || !password) throw new Error('Set FRIGAC_QA_USERNAME and FRIGAC_QA_PASSWORD to the local Worker QA credentials.');
const baseURL = new URL(process.env.FRIGAC_QA_URL || 'http://127.0.0.1:8787');
if (!['localhost', '127.0.0.1', '[::1]'].includes(baseURL.hostname) || baseURL.username || baseURL.password) {
  throw new Error('Browser QA accepts a loopback Worker URL without embedded credentials.');
}
const { chromium } = await import(process.env.FRIGAC_PLAYWRIGHT_MODULE || 'playwright');
const output = fileURLToPath(new URL('../output/offers/', import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  baseURL: baseURL.href,
  httpCredentials: { username, password },
  viewport: { width: 1440, height: 1100 }
});
const page = await context.newPage();
page.setDefaultTimeout(15_000);
const runtimeErrors = [];
page.on('pageerror', error => runtimeErrors.push(error.message));
const results = [];
const checks = [];
let scenario = 'initialization';
let failure = null;
const printableHeightPx = 1123; // Full A4 height (297 mm); page content has its own padding.
const rowAt = index => page.locator('.device-row').nth(index);

async function open() {
  const response = await page.goto(new URL('/panel/oferty/', baseURL).href);
  assert.equal(response?.status(), 200, 'local Worker must serve the authenticated panel');
  assert.match(response.headers()['cache-control'] || '', /private.*no-store/, 'test the Worker, not the unprotected Astro dev server');
  await page.waitForSelector('.device-row');
  await page.locator('#without-customer').uncheck();
}

async function setDevice(index, { modelSlug, powerKw, colorName }) {
  const row = rowAt(index);
  await row.locator('[data-model]').selectOption(modelSlug);
  if (powerKw !== undefined) await row.locator('[data-power]').selectOption(String(powerKw));
  if (colorName !== undefined) await row.locator('[data-color]').selectOption(colorName);
}

async function countDevices(count) {
  while (await page.locator('.device-row').count() > count) await page.locator('[data-remove]').last().click();
  while (await page.locator('.device-row').count() < count) await page.locator('#add-device').click();
  const slugs = ['gree-clivia', 'gree-airy', 'kaisai-geo-plus', 'kaisai-art', 'kaisai-air', 'kaisai-fly-plus', 'kaisai-ice', 'gree-amber-prestige'];
  for (let index = 0; index < count; index++) await setDevice(index, { modelSlug: slugs[index] });
}

async function prepare() {
  await page.locator('button[type=submit]').click();
  await page.waitForSelector('#offer-preview .offer-page');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll('#offer-preview img')].map(image => image.decode()));
  });
  const text = await page.locator('#offer-preview').innerText();
  assert.doesNotMatch(text, /\b(?:null|undefined|NaN)\b/, 'missing data must not leak into customer output');
}

async function capture(name) {
  scenario = name;
  await page.emulateMedia({ media: 'print' });
  try {
    const dimensions = await page.locator('.offer-page').evaluateAll(pages => pages.map(element => {
      const rect = element.getBoundingClientRect();
      const children = [...element.children];
      const footer = children.find(child => child.classList.contains('document-footer'));
      const footerRect = footer?.getBoundingClientRect();
      return {
        title: element.querySelector('h2')?.textContent?.trim(), className: element.className,
        height: rect.height, width: rect.width, scrollHeight: element.scrollHeight, scrollWidth: element.scrollWidth,
        maxChildBottom: Math.max(...children.map(child => child.getBoundingClientRect().bottom - rect.top)),
        maxContentBottom: Math.max(...children.filter(child => child !== footer).map(child => child.getBoundingClientRect().bottom - rect.top)),
        footerTop: footerRect ? footerRect.top - rect.top : null,
        footerBottom: footerRect ? footerRect.bottom - rect.top : null
      };
    }));
    assert.ok(dimensions.length > 0, `${name}: missing document pages`);
    assert.ok(dimensions.every(item => item.scrollWidth <= item.width + 1), `${name}: horizontal page overflow`);
    assert.ok(dimensions.every(item => item.height <= printableHeightPx), `${name}: page exceeds printable A4 height: ${JSON.stringify(dimensions.map((item, index) => ({ index, title: item.title, className: item.className, height: item.height, maxContentBottom: item.maxContentBottom, footerTop: item.footerTop })))}`);
    assert.ok(dimensions.every(item => item.scrollHeight <= item.height + 1 && item.maxChildBottom <= item.height + 1), `${name}: content overflows logical page`);
    assert.ok(dimensions.every(item => item.footerTop !== null && item.footerBottom !== null), `${name}: missing document footer`);
    assert.ok(dimensions.every(item => item.maxContentBottom <= item.footerTop - 2), `${name}: content overlaps the absolute footer or leaves less than a 2 px gap: ${JSON.stringify(dimensions.map(({ maxContentBottom, footerTop }) => ({ maxContentBottom, footerTop })))}`);
    const path = `${output}/${name}.pdf`;
    await page.pdf({ path, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
    const pdf = await readFile(path);
    assert.ok(pdf.subarray(0, 5).equals(Buffer.from('%PDF-')), `${name}: invalid PDF output`);
    // Chromium emits page objects uncompressed; exclude the /Pages tree object.
    const physicalPages = [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page(?=[\s/>])/g)].length;
    assert.ok(physicalPages > 0, `${name}: no physical PDF pages found`);
    assert.equal(physicalPages, dimensions.length, `${name}: unexpected PDF fragmentation (${physicalPages} physical, ${dimensions.length} logical)`);
    results.push({ name, physicalPages, logicalPages: dimensions.length, maxHeight: Math.max(...dimensions.map(item => item.height)), dimensions });
  } finally {
    await page.emulateMedia({ media: 'screen' });
  }
}

async function fillEnergy() {
  await page.locator('#energy-area').fill('25');
  await page.locator('#energy-price').fill('1.15');
}

async function selectAllAdditional() {
  for (const checkbox of await page.locator('[name=additionalPriority]:not(:disabled)').all()) await checkbox.check();
}

function currency(value) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(value);
}

async function assertVariant(selection) {
  const expected = resolveOfferSelection(selection);
  await setDevice(0, selection);
  assert.equal(await page.locator('#offer-preview .offer-page').count(), 0, 'selection change clears the previous preview');
  assert.equal(await page.locator('#print-offer').isDisabled(), true);
  assert.equal(await rowAt(0).locator('[data-price]').textContent(), currency(expected.price));
  await prepare();
  const product = page.locator('#offer-preview .offer-page').filter({ has: page.locator('.device-image') }).first();
  assert.equal(await product.locator('.device-image').getAttribute('src'), expected.image);
  assert.ok((await product.innerText()).includes(currency(expected.price)));
  const colors = expected.model.product.colors ?? [];
  if (colors.length > 1) {
    const stack = product.locator('.device-color-stack');
    assert.deepEqual((await stack.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')))).sort(), colors.map(color => color.image).sort());
    assert.equal(await stack.evaluate(element => getComputedStyle(element).backgroundColor), 'rgba(0, 0, 0, 0)');
    const caption = await product.locator('.color-caption').innerText();
    for (const color of colors) assert.ok(caption.includes(color.name));
    assert.ok(caption.includes(`Cena dla koloru: ${expected.color.name}`));
  }
}

async function printRace(regenerate) {
  await prepare();
  await page.evaluate(() => {
    window.__offerQA = { calls: 0, pending: [], originalPrint: window.print, originalDecode: HTMLImageElement.prototype.decode };
    window.print = () => { window.__offerQA.calls++; };
    HTMLImageElement.prototype.decode = function () { return new Promise(resolve => window.__offerQA.pending.push(resolve)); };
  });
  try {
    await page.locator('#print-offer').click();
    await page.waitForFunction(() => window.__offerQA.pending.length > 0);
    await page.locator('#customer').fill(regenerate ? 'Nowy klient po przygotowaniu dokumentu' : 'Edycja podczas ładowania zdjęć');
    assert.equal(await page.locator('#offer-preview .offer-page').count(), 0);
    if (regenerate) {
      await page.locator('button[type=submit]').click();
      await page.waitForSelector('#offer-preview .offer-page');
    }
    await page.evaluate(async () => {
      window.__offerQA.pending.splice(0).forEach(resolve => resolve());
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    assert.equal(await page.evaluate(() => window.__offerQA.calls), 0, 'editing must abort an in-flight print, including when the preview is regenerated');
    assert.equal(await page.locator('#print-offer').isDisabled(), !regenerate);
  } finally {
    await page.evaluate(() => {
      window.print = window.__offerQA.originalPrint;
      HTMLImageElement.prototype.decode = window.__offerQA.originalDecode;
      delete window.__offerQA;
    });
  }
}

try {
  const shortcut = await page.goto(new URL('/oferty', baseURL).href);
  assert.equal(shortcut?.status(), 200);
  assert.equal(new URL(page.url()).pathname, '/panel/oferty/');
  const sitemap = await context.request.get(new URL('/sitemap.xml', baseURL).href);
  assert.doesNotMatch(await sitemap.text(), /<loc>[^<]*\/(?:oferty|panel)(?:[\/\.<])/);
  checks.push('/oferty redirects to the authenticated panel and internal routes stay outside the sitemap');
  await page.waitForSelector('.device-row');
  assert.equal(await page.locator('.panel-header .home-logo').getAttribute('href'), '/');
  assert.equal(await page.locator('#without-customer').isChecked(), true);
  assert.equal(await page.locator('#customer').isVisible(), false);
  for (const select of await page.locator('[data-color]').all()) assert.equal(await select.inputValue(), '');
  await prepare();
  assert.equal(await page.locator('.offer-page .device-hero').count(), 0, 'general offer does not emphasize noise by default');
  for (const article of await page.locator('.offer-page').all()) {
    assert.match(await article.locator('.spec-grid').innerText(), /ciśnienie akustyczne/);
    assert.equal(await article.locator('.home-logo').getAttribute('href'), 'https://frigac.pl');
  }
  assert.doesNotMatch(await page.locator('#offer-preview').innerText(), /PRZYGOTOWANO DLA|Klient indywidualny/);
  assert.match(await page.locator('.color-price-note').nth(0).innerText(), /Wszystkie kolory w tej samej cenie/);
  assert.match(await page.locator('.color-price-note').nth(1).innerText(), /dopłata 100/);
  assert.equal(await page.locator('#download-offer').innerText(), 'Pobierz PDF');
  assert.equal(await page.locator('#print-offer').innerText(), 'Drukuj');
  const logicalDownloadPages = await page.locator('#offer-preview .offer-page').count();
  await page.locator('#pdf-filename').fill('Oferta QA: klient/test?');
  assert.equal(await page.locator('#offer-preview .offer-page').count(), logicalDownloadPages, 'changing only the PDF filename keeps the prepared preview');
  const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
  await page.locator('#download-offer').click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'Oferta QA klient test.pdf');
  const downloadedPath = `${output}/pobrana-oferta.pdf`;
  await download.saveAs(downloadedPath);
  const downloadedPdf = await readFile(downloadedPath);
  assert.ok(downloadedPdf.subarray(0, 5).equals(Buffer.from('%PDF-')), 'downloaded offer must be a PDF');
  const downloadedPages = [...downloadedPdf.toString('latin1').matchAll(/\/Type\s*\/Page(?=[\s/>])/g)].length;
  assert.equal(downloadedPages, logicalDownloadPages, 'downloaded PDF keeps one physical page per offer page');
  checks.push('PDF download is separate from print, keeps the prepared preview, sanitizes the chosen filename and preserves page count');
  await capture('oferta-bez-danych-klienta');

  await page.locator('#without-customer').uncheck();
  await page.locator('#customer').fill('Klient ukryty QA');
  await page.locator('#location').fill('Adres ukryty QA');
  await prepare();
  assert.match(await page.title(), /Klient ukryty QA/);
  await page.locator('#without-customer').check();
  assert.equal(await page.locator('.offer-page').count(), 0);
  assert.doesNotMatch(await page.title(), /Klient ukryty QA/);
  await page.locator('#include-summary').check();
  await prepare();
  assert.doesNotMatch(await page.locator('#offer-preview').innerText(), /Klient ukryty QA|Adres ukryty QA|Przygotowano dla|PRZYGOTOWANO DLA|Klient indywidualny/);
  await capture('oferta-bez-klienta-z-podsumowaniem');
  await page.locator('#without-customer').uncheck();
  assert.equal(await page.locator('#customer').inputValue(), 'Klient ukryty QA');
  checks.push('anonymous mode is the default, removes customer/address from every page and title, and restores fields when disabled');

  await open(); await countDevices(1);
  for (const [modelSlug, powerKw, expected] of [
    ['gree-airy', 2.7, /dopłata 200/],
    ['gree-airy', 3.5, /dopłata 100/],
    ['gree-clivia', 3.5, /Wszystkie kolory w tej samej cenie/],
    ['kaisai-art', 7, /200.*mniej od ceny bazowej/],
    ['kaisai-ice', 5.3, /cena do potwierdzenia/]
  ]) {
    await setDevice(0, { modelSlug, powerKw, colorName: '' });
    await prepare();
    assert.match(await page.locator('.color-price-note').innerText(), expected);
    assert.equal(await page.locator('.device-color-stack img').count(), resolveOfferSelection({ modelSlug, powerKw }).colorPrices.length);
  }
  await capture('kolor-domyslny-brak-ceny-koloru');
  checks.push('default palette uses current-power surcharges, equal prices, cheaper colors and unknown prices without assumptions');
  await open();
  assert.equal(await page.locator('.device-row').count(), 3);
  await page.locator('#customer').fill('Zażółć gęślą jaźń — oferta przykładowa');
  await page.locator('#location').fill('Gdańsk, ul. Łąkowa ąęłńóśźż');
  for (const count of [1, 3, 5, 8]) {
    scenario = `oferta-${count}-urzadzen`;
    await countDevices(count);
    await page.locator('#main-priority').selectOption('general');
    await prepare();
    assert.equal(await page.locator('#offer-preview .offer-page').count(), count, 'default offer has exactly one page per selected model');
    assert.ok((await page.locator('#offer-preview .offer-page').evaluateAll(pages => pages.map(element => element.querySelectorAll('.device-image').length))).every(imageCount => imageCount === 1), 'each default model page contains exactly one main product photograph');
    await capture(scenario);
  }
  assert.equal(await page.locator('#add-device').isDisabled(), true);
  await countDevices(3);
  for (const priority of ['quiet', 'heating', 'efficiency', 'price', 'airflow', 'air-quality', 'design', 'year-round']) {
    scenario = `priorytet-${priority}`;
    await page.locator('#main-priority').selectOption(priority);
    await prepare();
    assert.equal(await page.locator('.offer-page:has(.device-heading)').count(), 3, `${priority}: every model must have exactly one product page`);
    assert.equal(await page.locator('.offer-page').count(), 3, `${priority}: product details must not create continuation pages`);
    if (priority === 'quiet') assert.match(await page.locator('.device-hero').first().innerText(), /hałas/);
    else {
      assert.doesNotMatch((await page.locator('.device-hero').allTextContents()).join(' '), /hałas/);
      for (const spec of await page.locator('.offer-page:has(.device-image) .spec-grid').all()) assert.match(await spec.innerText(), /ciśnienie akustyczne/);
    }
    await capture(scenario);
  }
  await page.locator('#main-priority').selectOption('general');
  await page.locator('[name=additionalPriority][value=air-quality]').check();
  await prepare();
  assert.match(await page.locator('.device-hero').first().innerText(), /Lampa UVC/);
  assert.doesNotMatch((await page.locator('.device-hero').allTextContents()).join(' '), /hałas/);
  await capture('ogolna-z-priorytetem-jakosc-powietrza');
  await page.locator('[name=additionalPriority][value=air-quality]').uncheck();
  await page.locator('#main-priority').selectOption('heating-cost');
  await page.locator('[name=additionalPriority][value=cooling-cost]').check();
  await fillEnergy();
  await prepare(); await capture('koszty-wspolne');
  await page.locator('#energy-layout').selectOption('per-device');
  await prepare(); await capture('koszty-osobne');
  await page.locator('#main-priority').selectOption('design');
  await selectAllAdditional();
  await page.locator('#offer-notes').fill('Uzgodniony zakres obejmuje standardowy montaż. '.repeat(25));
  await prepare(); await capture('wszystkie-priorytety');
  assert.equal(await page.locator('.offer-page:has(.device-heading)').count(), 3, 'even all priorities keep one product page per model');
  assert.doesNotMatch(await page.locator('#offer-preview').innerText(), /Dalsze parametry|Kolor wpływa na cenę/);

  scenario = 'stress-maksymalne-dane';
  await countDevices(8);
  await page.locator('#customer').fill('Zażółć gęślą jaźń, przykładowy klient i nazwa firmy. '.repeat(4).slice(0, 120));
  await page.locator('#location').fill('Gdańsk, ul. Łąkowa 123/45 — przykładowy długi adres montażu. '.repeat(4).slice(0, 180));
  await page.locator('#offer-number').fill('FRIGAC/OFERTA/PRZYKLADOWA/'.repeat(3).slice(0, 64));
  await page.locator('#include-validity').check();
  await page.locator('#valid-days').fill('365');
  await page.locator('#energy-layout').selectOption('shared');
  await page.locator('#offer-notes').fill('Uzgodniony zakres obejmuje standardowy montaż oraz ustalenia z klientem. '.repeat(30).slice(0, 1200));
  await prepare(); await capture(scenario);
  assert.equal(await page.locator('.offer-page:has(.device-heading)').count(), 8, 'stress: product pages stay one per model');
  assert.equal(await page.locator('#offer-notes').inputValue().then(value => value.length), 1200);
  checks.push('8 devices, all priorities, maximum customer/address/reference lengths and 1200-character notes');

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${output}/panel-desktop.png`, fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${output}/panel-mobile.png`, fullPage: false });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'mobile document horizontal overflow');
  await page.setViewportSize({ width: 1440, height: 1100 });

  scenario = 'regresja-tylko-chlodzenie';
  await open(); await countDevices(1);
  await setDevice(0, { modelSlug: 'gree-g-time', powerKw: 3.5 });
  await page.locator('#main-priority').selectOption('cooling-cost');
  await fillEnergy(); await prepare();
  const coolingText = await page.locator('#offer-preview').innerText();
  assert.match(coolingText, /Chłodzenie · sezon/);
  assert.doesNotMatch(coolingText, /Pominięto koszt ogrzewania|Ogrzewanie wymaga indywidualnego doboru/);
  await capture(scenario);
  checks.push('cooling-only offer excludes warnings for the unselected heating mode');

  scenario = 'regresja-tozsamosc-wariantow';
  await open(); await countDevices(2);
  await page.locator('#include-summary').check();
  await setDevice(0, { modelSlug: 'gree-airy', powerKw: 2.7, colorName: 'Biały' });
  await setDevice(1, { modelSlug: 'gree-airy', powerKw: 3.5, colorName: 'Ciemny' });
  await prepare();
  const comparisonText = await page.locator('.summary-page .comparison-notes').innerText();
  assert.match(comparisonText, /Airy 2,7 kW · Biały/);
  assert.match(comparisonText, /Airy 3,5 kW · Ciemny/);
  await capture(scenario);
  checks.push('shared comparison winners identify both power and selected color');

  scenario = 'warianty-ceny-zdjecia';
  await open(); await countDevices(1);
  await assertVariant({ modelSlug: 'gree-clivia', powerKw: 3.5, colorName: 'Biały' });
  await assertVariant({ modelSlug: 'gree-clivia', powerKw: 3.5, colorName: 'Granatowy' });
  await assertVariant({ modelSlug: 'gree-airy', powerKw: 3.5, colorName: 'Biały' });
  await assertVariant({ modelSlug: 'gree-airy', powerKw: 3.5, colorName: 'Ciemny' });
  await assertVariant({ modelSlug: 'gree-airy', powerKw: 5.3, colorName: 'Ciemny' });
  checks.push('color/power changes refresh the exact central price, assigned image and preview');

  scenario = 'regresja-druk-edycja';
  await printRace(false);
  await printRace(true);
  checks.push('editing during image decode aborts pending print for both cleared and regenerated previews');

  scenario = 'escapowanie-i-brakujace-dane';
  await page.locator('#customer').fill('<img src=x onerror=alert(1)>');
  assert.equal(await page.locator('#offer-preview .offer-page').count(), 0);
  assert.equal(await page.locator('#print-offer').isDisabled(), true);
  await prepare();
  assert.equal(await page.locator('#offer-preview img[src=x]').count(), 0);
  assert.ok((await page.locator('#offer-preview').innerText()).includes('<img src=x onerror=alert(1)>'));
  for (const selection of [
    { modelSlug: 'gree-u-crown', powerKw: 3.5 },
    { modelSlug: 'kaisai-ice', powerKw: 5.3, colorName: 'Czarny' }
  ]) {
    await setDevice(0, selection);
    await page.locator('button[type=submit]').click();
    assert.equal(await page.locator('#offer-preview .offer-page').count(), 0);
    assert.match(await page.locator('#offer-message').innerText(), /Brak aktualnej ceny/);
    assert.equal(await page.locator('#print-offer').isDisabled(), true);
  }
  await setDevice(0, { modelSlug: 'gree-airy', powerKw: 3.5, colorName: 'Biały' });
  await rowAt(0).locator('[data-color]').evaluate(select => {
    select.add(new Option('Nieznany kolor QA', 'Nieznany kolor QA'));
    select.value = 'Nieznany kolor QA';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('button[type=submit]').click();
  assert.match(await page.locator('#offer-message').innerText(), /Nieznany kolor/);
  assert.equal(await page.locator('#offer-preview .offer-page').count(), 0);
  checks.push('customer text is escaped; unpriced powers/colors and invalid combinations cannot print');

  scenario = 'zdjecia-wspolna-skala';
  await open(); await countDevices(3);
  await setDevice(0, { modelSlug: 'gree-g-time', powerKw: 3.5 });
  await setDevice(1, { modelSlug: 'kaisai-geo-plus', powerKw: 3.5 });
  await setDevice(2, { modelSlug: 'gree-clivia', powerKw: 3.5 });
  await prepare();
  const widths = await page.locator('.device-image').evaluateAll(images => images.map(img => img.parentElement.getBoundingClientRect().width));
  assert.ok(Math.max(...widths) - Math.min(...widths) < 1, 'visible product bounds have the same width for single photos and color stacks');
  await capture(scenario);

  scenario = 'automatyczny-uvc';
  const manualBefore = await page.locator('.device-row select').evaluateAll(selects => selects.map(select => select.value));
  await page.locator('[name=selectionMode][value=auto]').check();
  assert.equal(await page.locator('#manual-selection').isVisible(), false);
  assert.equal(await page.locator('#auto-selection').isVisible(), true);
  await page.locator('#without-customer').check();
  await page.locator('#room-area').fill('25');
  await page.locator('#main-priority').selectOption('air-quality');
  await page.locator('#room-uvc').check();
  await prepare();
  const expected = recommendOffer({ area:25, height:2.6, sloped:false, minHeight:0, slopePercent:100, sun:'standard', location:'middle', glazing:'no', insulation:'standard', occupants:2, equipmentW:0, layout:'open', count:3, requireUvc:true, maxPrice:null }, {main:'air-quality',additional:[]});
  assert.equal(await page.locator('.device-image').count(), 3);
  assert.equal(await page.locator('.sizing-page').count(), 1);
  assert.match(await page.locator('.sizing-page').innerText(), /65 m³/);
  for (const item of expected.items) assert.ok((await page.locator('#auto-selection-result').innerText()).includes(item.model.product.ctaName ?? item.model.name));
  assert.equal(await page.locator('.selection-reason').count(), 3);
  await capture(scenario);

  await page.locator('#room-count').selectOption('2');
  await prepare();
  const brands = await page.locator('.device-brand').allTextContents();
  assert.ok(brands.includes('GREE') && brands.includes('KAISAI'));
  await page.locator('#room-brand').selectOption('gree');
  await prepare();
  assert.ok((await page.locator('.device-brand').allTextContents()).every(brand => brand === 'GREE'));
  assert.equal(await page.locator('.device-image').count(), 2);
  await capture('automatyczny-tylko-gree');
  await page.locator('#room-brand').selectOption('all');
  await page.locator('#room-count').selectOption('8');
  await prepare();
  assert.equal(await page.locator('.device-image').count(), 4);
  assert.match(await page.locator('#offer-message').innerText(), /Znaleziono 4 z 8/);
  await capture('automatyczny-mniej-propozycji');

  await page.locator('#room-sloped').check();
  await page.locator('#room-area').fill('30');
  await page.locator('#room-height').fill('3');
  await page.locator('#room-min-height').fill('1');
  await page.locator('#room-slope-percent').fill('50');
  await page.locator('#room-location').selectOption('top');
  await page.locator('#room-uvc').uncheck();
  await page.locator('#main-priority').selectOption('general');
  await prepare();
  assert.match(await page.locator('.sizing-page').innerText(), /75 m³/);
  assert.match(await page.locator('.sizing-page').innerText(), /50% podłogi/);
  await capture('automatyczny-skosy');

  await page.locator('#main-priority').selectOption('heating-cost');
  await page.locator('#energy-price').fill('1.15');
  assert.equal(await page.locator('#energy-area').inputValue(), '30');
  assert.equal(await page.locator('#energy-area').getAttribute('readonly'), '');
  await selectAllAdditional();
  await prepare();
  await capture('automatyczny-wszystkie-potrzeby');
  assert.match(await page.locator('#offer-message').innerText(), /Moc dobrano do chłodzenia/);

  for (const [selector, value, expectedError] of [
    ['#room-layout', 'separate', /Oddzielne pokoje/],
    ['#room-budget', '100', /Brak modeli/],
    ['#room-min-height', '4', /wysokość minimalną/]
  ]) {
    if (selector === '#room-layout') await page.locator(selector).selectOption(value);
    else await page.locator(selector).fill(value);
    await page.locator('button[type=submit]').click();
    assert.equal(await page.locator('.offer-page').count(), 0);
    assert.equal(await page.locator('#print-offer').isDisabled(), true);
    assert.match(await page.locator('#offer-message').innerText(), expectedError);
    if (selector === '#room-layout') await page.locator(selector).selectOption('open');
    else await page.locator(selector).fill(selector === '#room-budget' ? '' : '1');
  }
  await page.locator('[name=selectionMode][value=manual]').check();
  assert.equal(await page.locator('#auto-selection').isVisible(), false);
  assert.deepEqual(await page.locator('.device-row select').evaluateAll(selects => selects.map(select => select.value)), manualBefore);
  assert.equal(await page.locator('#energy-area').inputValue(), '');
  checks.push('automatic selection: UVC, limited matches, sloped volume, all priorities, shared energy inputs, invalid rooms and restoration of manual choices');

  scenario = 'kaisai-pro-heat-sprawnosc';
  await open(); await countDevices(1);
  await page.locator('#main-priority').selectOption('efficiency');
  for (const [powerKw, scop] of [[2.6, '4,6'], [3.5, '4,7'], [5.2, '4,6'], [7, '4,7']]) {
    await setDevice(0, { modelSlug: 'kaisai-pro-heat-plus', powerKw });
    await prepare();
    const productText = await page.locator('.offer-page:has(.device-heading)').innerText();
    assert.match(productText, new RegExp(`8,5 / ${scop}`));
    assert.match(productText, /A\+\+\+.*A\+\+.*Sezon umiarkowany/s);
  }
  await capture(scenario);
  checks.push('PRO HEAT+ efficiency shows SEER, power-specific SCOP, both energy classes and the documented moderate heating season');

  scenario = 'bez-zduplikowanych-wariantow';
  await open(); await countDevices(2);
  await setDevice(0, { modelSlug: 'gree-g-time', powerKw: 3.5 });
  await rowAt(1).locator('[data-model]').selectOption('gree-g-time');
  assert.notEqual(await rowAt(1).locator('[data-power]').inputValue(), '3.5');
  assert.equal(await rowAt(1).locator('[data-power] option[value="3.5"]').evaluate(option => option.disabled), true);
  await prepare();
  assert.equal(await page.locator('.offer-page:has(.device-heading)').count(), 2);
  await rowAt(0).locator('[data-model]').selectOption('gree-clivia');
  await rowAt(1).locator('[data-model]').selectOption('gree-clivia');
  await rowAt(1).locator('[data-power]').selectOption('3.5');
  assert.equal(await rowAt(0).locator('[data-power]').inputValue(), await rowAt(1).locator('[data-power]').inputValue());
  assert.notEqual(await rowAt(0).locator('[data-color]').inputValue(), await rowAt(1).locator('[data-color]').inputValue());
  assert.equal(await rowAt(1).locator('[data-color] option[value=""]').evaluate(option => option.disabled), true);
  await prepare();
  await capture(scenario);
  await open();
  const existingModels = await page.locator('.device-row [data-model]').evaluateAll(selects => selects.map(select => select.value));
  await page.locator('#add-device').click();
  assert.ok(!existingModels.includes(await rowAt(3).locator('[data-model]').inputValue()), 'adding a row chooses another model by default');
  checks.push('duplicate model + power + color is unavailable immediately; the same model remains selectable with another power or color');
  assert.deepEqual(runtimeErrors, [], 'no JavaScript runtime errors');
} catch (error) {
  failure = { scenario, message: error instanceof Error ? error.message : String(error) };
  await page.emulateMedia({ media: 'screen' }).catch(() => {});
  await page.screenshot({ path: `${output}/failure.png`, fullPage: false }).catch(() => {});
  throw error;
} finally {
  await writeFile(`${output}/browser-qa.json`, JSON.stringify({ testedAt: new Date().toISOString(), results, checks, runtimeErrors, failure }, null, 2) + '\n');
  await browser.close();
}
console.log(JSON.stringify({ pdfScenarios: results.length, checks, documents: results.map(({ name, logicalPages, physicalPages, maxHeight }) => ({ name, logicalPages, physicalPages, maxHeight })) }, null, 2));
