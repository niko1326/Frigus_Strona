import { ENERGY_MODELS } from '../config/lineups';
import { COMPANY, EMAIL, PHONE_DISPLAY, PRICING, SITE } from '../config/site';
import { OFFER_PRIORITIES, getOfferPriorityFields, normalizeOfferPriorities, type OfferPriorities } from '../config/offer-priorities';
import { TECHNICAL_FIELDS, readPath, type TechnicalFieldPath } from '../config/product-technical';
import { calculateOfferComparisons, calculateOfferEnergy, resolveOfferItems, resolveOfferSelection, MAX_OFFER_ITEMS, type OfferItem, type OfferSelection, type OfferEnergyInput, type OfferEnergyResult } from '../utils/offers';
import { getProductColors } from '../utils/product-technical';
import { HEATING_ASSUMPTIONS, USAGE_PROFILES, formatEnergyNumber } from '../utils/energy-estimate.mjs';
import { recommendOffer, type RoomInput, type RecommendedOffer } from '../utils/offer-recommendations';
import imageBounds from '../config/offer-image-bounds.json';

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const form = byId<HTMLFormElement>('offer-form');
const rows = byId<HTMLDivElement>('device-rows');
const preview = byId<HTMLDivElement>('offer-preview');
const message = byId<HTMLDivElement>('offer-message');
const printButton = byId<HTMLButtonElement>('print-offer');
const downloadButton = byId<HTMLButtonElement>('download-offer');
const addButton = byId<HTMLButtonElement>('add-device');
const mainPriority = byId<HTMLSelectElement>('main-priority');
const inputValue = (id: string) => (byId<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(id)).value.trim();
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
const number = (value: number) => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 3 }).format(value);
const money = (value: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(value);
const range = (values: number[]) => values.map(value => money(value)).join(' – ');
const fieldInfo = new Map<string, readonly [string, string]>(TECHNICAL_FIELDS.map(([path, label, unit]) => [path, [label, unit]]));
const featureDescriptions: Record<string, string> = {
  'Sterowanie Wi-Fi': 'Wygodna obsługa',
  'Lampa UVC': 'Higiena nawiewu',
  Jonizator: 'Jonizacja powietrza',
  'Grzałka tacy skroplin': 'Wsparcie pracy zimą',
  'Grzałka karteru': 'Wsparcie przy mrozie',
  Samooczyszczanie: 'Czystość wymiennika',
  'Tryb cichy': 'Niższa głośność pracy'
};
let sequence = 0;
let previewVersion = 0;
let manualEnergy: { area: string; insulation: string } | null = null;

function warsawDate() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-');
}
function dateLabel(value: string) {
  return new Intl.DateTimeFormat('pl-PL', { timeZone: 'Europe/Warsaw', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00Z`));
}
byId<HTMLInputElement>('offer-date').value = warsawDate();
byId<HTMLInputElement>('offer-number').value = `FR/${warsawDate().replaceAll('-', '')}`;

function markDirty() {
  previewVersion++;
  preview.replaceChildren();
  byId('preview-heading').hidden = true;
  printButton.disabled = true;
  downloadButton.disabled = true;
  message.textContent = '';
  document.title = 'Oferty · FrigAC';
  byId('auto-selection-result').hidden = true;
  byId('auto-selection-result').replaceChildren();
}

const automaticSelection = () => form.querySelector<HTMLInputElement>('[name=selectionMode]:checked')!.value === 'auto';
function updateSelectionMode() {
  const automatic = automaticSelection();
  byId('manual-selection').hidden = automatic;
  rows.querySelectorAll<HTMLSelectElement>('select').forEach(select => {
    select.disabled = automatic || select.hasAttribute('data-color') && select.options.length === 1;
  });
  byId('device-count').hidden = automatic;
  byId('auto-selection').hidden = !automatic;
  byId<HTMLFieldSetElement>('auto-selection').disabled = !automatic;
  const sloped = automatic && byId<HTMLInputElement>('room-sloped').checked;
  byId('room-slopes').hidden = !sloped;
  byId<HTMLFieldSetElement>('room-slopes').disabled = !sloped;
  byId('room-height-label').textContent = sloped ? 'Maksymalna wysokość (m)' : 'Wysokość pomieszczenia (m)';
  const energyArea = byId<HTMLInputElement>('energy-area');
  const energyInsulation = byId<HTMLSelectElement>('energy-insulation');
  if (automatic) {
    manualEnergy ??= { area: energyArea.value, insulation: energyInsulation.value };
    energyArea.value = inputValue('room-area');
    energyInsulation.value = inputValue('room-insulation');
  } else if (manualEnergy) {
    energyArea.value = manualEnergy.area;
    energyInsulation.value = manualEnergy.insulation;
    manualEnergy = null;
  }
  energyArea.readOnly = automatic;
  energyInsulation.disabled = automatic;
  form.querySelector<HTMLButtonElement>('button[type=submit]')!.textContent = automatic ? 'Dobierz i przygotuj ofertę' : 'Przygotuj podgląd oferty';
}

function readRoom(): RoomInput {
  return {
    area: Number(inputValue('room-area')), height: Number(inputValue('room-height')),
    sloped: byId<HTMLInputElement>('room-sloped').checked, minHeight: Number(inputValue('room-min-height')),
    slopePercent: Number(inputValue('room-slope-percent')), count: Number(inputValue('room-count')),
    brand: inputValue('room-brand') as RoomInput['brand'],
    layout: inputValue('room-layout') as RoomInput['layout'], insulation: inputValue('room-insulation') as RoomInput['insulation'],
    sun: inputValue('room-sun') as RoomInput['sun'], location: inputValue('room-location') as RoomInput['location'],
    glazing: inputValue('room-glazing') as RoomInput['glazing'], occupants: Number(inputValue('room-occupants')),
    equipmentW: Number(inputValue('room-equipment')), requireUvc: byId<HTMLInputElement>('room-uvc').checked,
    maxPrice: inputValue('room-budget') ? Number(inputValue('room-budget')) : null
  };
}

function updateCustomerFields() {
  const hidden = byId<HTMLInputElement>('without-customer').checked;
  form.querySelectorAll<HTMLElement>('[data-customer-field]').forEach(field => {
    field.hidden = hidden;
    field.querySelector('input')!.disabled = hidden;
  });
}

function updateValidityField() {
  const enabled = byId<HTMLInputElement>('include-validity').checked;
  byId('valid-days-field').hidden = !enabled;
  const days = byId<HTMLInputElement>('valid-days');
  days.disabled = !enabled;
  days.required = enabled;
}

function readSelection(row: HTMLElement): OfferSelection {
  return {
    modelSlug: row.querySelector<HTMLSelectElement>('[data-model]')!.value,
    powerKw: Number(row.querySelector<HTMLSelectElement>('[data-power]')!.value),
    colorName: row.querySelector<HTMLSelectElement>('[data-color]')!.value || null
  };
}

function selectionKey(selection: OfferSelection): string {
  try { return resolveOfferSelection(selection).id; }
  catch { return JSON.stringify([selection.modelSlug, selection.powerKw, selection.colorName ?? null]); }
}

function possibleSelections(modelSlug: string, preferredPower?: number, preferredColor?: string | null): OfferSelection[] {
  const model = ENERGY_MODELS.find(item => item.slug === modelSlug)!;
  const colors = getProductColors(model);
  const names = [...new Set([preferredColor ?? null, null, ...colors.map(color => color.name)])];
  const powers = [...model.variants].sort((a, b) =>
    Math.abs(a.powerKw - (preferredPower ?? 3.5)) - Math.abs(b.powerKw - (preferredPower ?? 3.5)) || a.powerKw - b.powerKw);
  return powers.flatMap(variant => names.map(colorName => ({ modelSlug, powerKw: variant.powerKw, colorName })));
}

function refreshAvailability(changedRow?: HTMLElement) {
  if (changedRow) {
    const otherKeys = new Set([...rows.children].filter(row => row !== changedRow).map(row => selectionKey(readSelection(row as HTMLElement))));
    const selected = readSelection(changedRow);
    if (otherKeys.has(selectionKey(selected))) {
      const candidate = possibleSelections(selected.modelSlug, selected.powerKw, selected.colorName).find(option => !otherKeys.has(selectionKey(option)));
      if (candidate) {
        changedRow.querySelector<HTMLSelectElement>('[data-power]')!.value = String(candidate.powerKw);
        changedRow.querySelector<HTMLSelectElement>('[data-color]')!.value = candidate.colorName ?? '';
        refreshRow(changedRow);
        changedRow.querySelector<HTMLElement>('[data-state]')!.textContent += ' Identyczny wariant jest już dodany; ustawiono inną dostępną wersję.';
      }
    }
  }
  for (const row of [...rows.children] as HTMLElement[]) {
    const selected = readSelection(row);
    const otherKeys = new Set([...rows.children].filter(other => other !== row).map(other => selectionKey(readSelection(other as HTMLElement))));
    const model = ENERGY_MODELS.find(item => item.slug === selected.modelSlug)!;
    row.querySelectorAll<HTMLOptionElement>('[data-model] option').forEach(option => {
      option.disabled = !possibleSelections(option.value).some(candidate => !otherKeys.has(selectionKey(candidate)));
    });
    row.querySelectorAll<HTMLOptionElement>('[data-power] option').forEach(option => {
      option.disabled = !possibleSelections(model.slug, Number(option.value), selected.colorName).filter(candidate => candidate.powerKw === Number(option.value)).some(candidate => !otherKeys.has(selectionKey(candidate)));
    });
    row.querySelectorAll<HTMLOptionElement>('[data-color] option').forEach(option => {
      option.disabled = otherKeys.has(selectionKey({ ...selected, colorName: option.value || null }));
    });
  }
}

function refreshRow(row: HTMLElement, modelChanged = false) {
  const modelSelect = row.querySelector<HTMLSelectElement>('[data-model]')!;
  const model = ENERGY_MODELS.find(item => item.slug === modelSelect.value)!;
  const power = row.querySelector<HTMLSelectElement>('[data-power]')!;
  const colors = row.querySelector<HTMLSelectElement>('[data-color]')!;
  const currentPower = Number(power.value);
  if (modelChanged || !power.options.length) {
    power.replaceChildren(...model.variants.map(variant => new Option(`${variant.label} kW`, String(variant.powerKw))));
    power.value = String(model.variants.find(variant => variant.powerKw === currentPower)?.powerKw ?? model.variants.find(variant => variant.powerKw >= 3 && variant.powerKw <= 3.6)?.powerKw ?? model.variants[0].powerKw);
    const availableColors = getProductColors(model);
    colors.replaceChildren(new Option(availableColors.length > 1 ? 'Domyślny — wszystkie kolory' : 'Domyślny', ''), ...availableColors.map(color => new Option(color.name, color.name)));
    colors.value = '';
    colors.disabled = availableColors.length === 0;
    row.querySelector<HTMLSpanElement>('[data-color-description]')!.textContent = availableColors.length ? '' : model.alt;
  }
  const price = row.querySelector<HTMLOutputElement>('[data-price]')!;
  const state = row.querySelector<HTMLParagraphElement>('[data-state]')!;
  try {
    const item = resolveOfferSelection(readSelection(row));
    price.value = money(item.price);
    state.textContent = item.conflictPaths.length ? `Do weryfikacji w raporcie danych: ${item.conflictPaths.join(', ')}. Zachowano obecne wartości; sporne parametry nie tworzą porównań ani obliczeń kosztów.` : '';
  } catch (error) {
    price.value = 'Brak ceny';
    state.textContent = error instanceof Error ? error.message : 'Sprawdź wybrany wariant.';
  }
}

function updateCount() {
  byId('device-count').textContent = `${rows.children.length} / ${MAX_OFFER_ITEMS}`;
  addButton.disabled = rows.children.length >= MAX_OFFER_ITEMS;
  rows.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(button => { button.disabled = rows.children.length <= 1; });
}

function addRow(slug?: string) {
  if (rows.children.length >= MAX_OFFER_ITEMS) return;
  slug ??= ENERGY_MODELS.find(model => !model.unavailable && ![...rows.children].some(row => (row as HTMLElement).querySelector<HTMLSelectElement>('[data-model]')!.value === model.slug))?.slug ?? ENERGY_MODELS[0].slug;
  const row = document.createElement('div');
  row.className = 'device-row';
  const id = ++sequence;
  row.innerHTML = `<label for="model-${id}">Model<select id="model-${id}" data-model aria-label="Model urządzenia ${id}"></select></label>
    <label for="power-${id}">Moc<select id="power-${id}" data-power aria-label="Moc urządzenia ${id}"></select></label>
    <label for="color-${id}">Kolor / wersja<select id="color-${id}" data-color aria-label="Kolor urządzenia ${id}"></select><span class="catalog-color" data-color-description></span></label>
    <output data-price class="device-price" aria-label="Aktualna cena"></output>
    <button type="button" data-remove class="remove-device" aria-label="Usuń urządzenie ${id}">Usuń</button><p class="device-state" data-state></p>`;
  const models = row.querySelector<HTMLSelectElement>('[data-model]')!;
  models.replaceChildren(...ENERGY_MODELS.filter(model => !model.unavailable).map(model => new Option(`${model.brandLabel} ${model.name}`, model.slug)));
  models.value = slug;
  models.addEventListener('change', () => { refreshRow(row, true); refreshAvailability(row); });
  for (const selector of ['[data-power]', '[data-color]']) row.querySelector(selector)!.addEventListener('change', () => { refreshRow(row); refreshAvailability(row); });
  row.querySelector('[data-remove]')!.addEventListener('click', () => { row.remove(); updateCount(); refreshAvailability(); markDirty(); });
  rows.append(row);
  refreshRow(row, true);
  refreshAvailability(row);
  updateCount();
}

function priorities(): OfferPriorities {
  return normalizeOfferPriorities(mainPriority.value, [...form.querySelectorAll<HTMLInputElement>('[name=additionalPriority]:checked')].map(input => input.value));
}
function updatePriorities() {
  for (const checkbox of form.querySelectorAll<HTMLInputElement>('[name=additionalPriority]')) {
    checkbox.disabled = checkbox.value === mainPriority.value;
    if (checkbox.disabled) checkbox.checked = false;
  }
  const selected = priorities();
  const hasEnergy = [selected.main, ...selected.additional].some(id => id === 'heating-cost' || id === 'cooling-cost');
  byId('energy-section').hidden = !hasEnergy;
  for (const id of ['energy-area', 'energy-price']) byId<HTMLInputElement>(id).required = hasEnergy;
}

type OfferDocument = {
  recommendation: RecommendedOffer | null;
  withoutCustomer: boolean;
  customer: string; location: string; reference: string; date: string; validUntil: string | null; notes: string;
  priorities: OfferPriorities; items: OfferItem[]; energyInput: OfferEnergyInput | null; energy: Map<string, OfferEnergyResult>;
};
const priorityLabel = (id: string) => OFFER_PRIORITIES.find(priority => priority.id === id)!.label;
const visiblePriorityLabels = (offer: OfferDocument) => [offer.priorities.main, ...offer.priorities.additional]
  .filter(id => id !== 'price').map(priorityLabel);
const priceFocusLabel = (item: OfferItem) => ({
  'kaisai-air': 'Rozsądny wybór',
  'kaisai-geo': 'Dobry stosunek jakości do ceny'
}[item.model.slug] ?? 'Komfort na co dzień');
const itemName = (item: OfferItem) => `${item.model.brandLabel} ${item.model.product.ctaName ?? item.model.name}`;
const itemIdentity = (item: OfferItem) => `${itemName(item)} ${item.variant.label} kW · ${variantCaption(item)}`;
const variantCaption = (item: OfferItem) => item.defaultColors ? 'Wszystkie kolory' : item.color?.name ?? 'Wersja katalogowa';
const itemCaption = (item: OfferItem) => item.defaultColors ? 'Wszystkie kolory do wyboru' : item.color?.name ?? item.model.alt;

function cutout(src: string, alt: string, main: boolean, stackStyle = '') {
  const bounds = imageBounds[src as keyof typeof imageBounds];
  if (!bounds) return `<img class="${main ? 'device-image' : 'device-color-image'}" src="${escape(src)}" alt="${escape(alt)}" width="640" height="240">`;
  return `<span class="device-cutout${stackStyle ? ' stacked-cutout' : ''}" style="--image-aspect:${bounds.width / bounds.height};${stackStyle}"><img class="${main ? 'device-image' : 'device-color-image'}" src="${escape(src)}" alt="${escape(alt)}" style="width:${bounds.sourceWidth / bounds.width * 100}%;height:${bounds.sourceHeight / bounds.height * 100}%;left:${-bounds.left / bounds.width * 100}%;top:${-bounds.top / bounds.height * 100}%;" width="${bounds.sourceWidth}" height="${bounds.sourceHeight}"></span>`;
}

function colorPriceNote(item: OfferItem): string {
  if (!item.defaultColors) return '';
  const groups = new Map<number | null, string[]>();
  for (const color of item.colorPrices) groups.set(color.difference, [...(groups.get(color.difference) ?? []), color.name]);
  if (groups.size === 1 && groups.has(0)) return 'Wszystkie kolory w tej samej cenie.';
  return [...groups].sort(([a], [b]) => a === 0 ? -1 : b === 0 ? 1 : 0).map(([difference, names]) => {
    const label = difference !== 0 && groups.has(0) && groups.size === 2 ? 'Pozostałe kolory' : names.join(', ');
    if (difference === null) return `${label}: cena do potwierdzenia.`;
    if (difference === 0) return `${label} w cenie bazowej.`;
    return difference > 0 ? `${label}: dopłata ${money(difference)}.` : `${label}: ${money(Math.abs(difference))} mniej od ceny bazowej.`;
  }).join(' ');
}

function productVisual(item: OfferItem) {
  const colors = getProductColors(item.model);
  const pictured = colors.filter(color => color.image);
  if (pictured.length < 2) return `<div class="device-single-stage">${cutout(item.image, item.color?.alt ?? item.model.alt, true)}</div><p class="device-caption">${escape(itemCaption(item))}</p>`;
  const front = pictured.find(color => color.image === item.image) ?? pictured[0];
  const stack = [front, ...pictured.filter(color => color !== front)];
  const pair = stack.length === 2;
  return `<div class="device-color-stack" role="group" aria-label="Wersje kolorystyczne ${escape(itemName(item))}">${stack.map((color, index) => {
    const progress = index / (stack.length - 1);
    return cutout(color.image!, color.alt ?? color.name, index === 0, `--stack-left:${pair ? 42 + progress * 16 : 38 + progress * 24}%;--stack-top:${pair ? 60 - progress * 20 : 72 - progress * 44}%;--stack-z:${stack.length - index};`);
  }).join('')}</div><p class="device-caption color-caption"><strong>${item.defaultColors ? 'Wszystkie kolory do wyboru' : `Cena dla koloru: ${escape(itemCaption(item))} · na pierwszym planie`}</strong><span>Kolory serii: ${colors.map(color => escape(color.name)).join(' · ')}</span></p>`;
}

function footer() {
  return `<footer class="document-footer"><span>${escape(COMPANY.legalName)} · NIP ${escape(COMPANY.nip)}</span><span>${escape(PHONE_DISPLAY)} · ${escape(EMAIL)} · ${escape(new URL(SITE.siteUrl).hostname)}</span><span class="document-page-number"></span></footer>`;
}
function header(offer: OfferDocument, caption: string) {
  return `<header class="document-header"><a class="home-logo" href="${escape(SITE.siteUrl)}" aria-label="FrigAC — strona główna"><img src="/brand/frigac-logo.svg" alt="FrigAC" width="144" height="44"></a><span><strong>${escape(offer.reference)}</strong><br>${escape(caption)}</span></header>`;
}
function page(offer: OfferDocument, caption: string, content: string, className = '') {
  return `<article class="offer-page ${className}">${header(offer, caption)}${content}${footer()}</article>`;
}
function formatField(path: TechnicalFieldPath, value: unknown): string {
  if (value === null) return 'Brak danych katalogowych';
  if (typeof value === 'boolean') return value ? 'Tak' : 'Nie';
  if (path === 'priceFromPLN') return money(Number(value));
  if (path === 'design.dimensions') {
    const dimensions = value as {widthMm: number; heightMm: number; depthMm: number};
    return `${dimensions.widthMm} × ${dimensions.heightMm} × ${dimensions.depthMm} mm (szer. × wys. × gł.)`;
  }
  if (path === 'heatingFeatures.lowTempPerformance') return (value as Array<{outdoorTempC:number;capacityKw:number|null;retainedPercent:number|null}>).map(point => `${point.outdoorTempC}°C: ${point.capacityKw !== null ? `${number(point.capacityKw)} kW` : `${point.retainedPercent}% deklarowanej mocy`}`).join('; ');
  if (Array.isArray(value)) return value.map(item => typeof item === 'number' ? number(item) : String(item)).join(' / ') + (fieldInfo.get(path)?.[1] ? ` ${fieldInfo.get(path)![1]}` : '');
  if (typeof value === 'number') return `${number(value)}${fieldInfo.get(path)?.[1] ? ` ${fieldInfo.get(path)![1]}` : ''}`;
  return String(value);
}

function comparisonNotes(offer: OfferDocument, item?: OfferItem) {
  const showNoiseComparison = [offer.priorities.main, ...offer.priorities.additional].includes('quiet');
  const comparisons = calculateOfferComparisons(offer.items).filter(comparison => (comparison.metric !== 'noise' || showNoiseComparison) && (!item || comparison.winnerIds.includes(item.id)));
  return comparisons.length ? `<ul class="comparison-notes">${comparisons.map(comparison => `<li>${escape(comparison.label)} ${item ? '' : `${escape(offer.items.filter(entry => comparison.winnerIds.includes(entry.id)).map(itemIdentity).join(', '))}: `}${escape(number(comparison.value))}${comparison.unit ? ` ${escape(comparison.unit)}` : ''}</li>`).join('')}</ul>` : '';
}

function cover(offer: OfferDocument) {
  const selected = visiblePriorityLabels(offer).join(' · ') || 'Modele dopasowane do Twoich potrzeb';
  return page(offer, 'Oferta z montażem', `<p class="document-kicker">KLIMATYZACJA Z MONTAŻEM</p><h1 class="document-title">Komfort dopasowany<br>do Twoich potrzeb.</h1><p class="document-lead">${escape(selected)}</p>
    <div class="customer-details">${offer.withoutCustomer ? '' : `<div><span>Przygotowano dla</span><strong>${escape(offer.customer || 'Klient indywidualny')}</strong>${offer.location ? `<span>${escape(offer.location)}</span>` : ''}</div>`}<div><span>Data oferty</span><strong>${escape(dateLabel(offer.date))}</strong>${offer.validUntil ? `<span>Ważna do ${escape(dateLabel(offer.validUntil))}</span>` : ''}</div></div>
    <h3>Wybrane warianty · ${offer.items.length}</h3><p class="document-terms">Warianty alternatywne dla tego samego pomieszczenia. Cena każdego wariantu obejmuje urządzenie i standardowy montaż do ${PRICING.standardInstallationMeters} mb.</p>
    <table class="offer-table"><thead><tr><th>Urządzenie / kolor</th><th>Moc chłodnicza</th><th>Cena z montażem</th></tr></thead><tbody>${offer.items.map(item => `<tr><td><strong>${escape(itemName(item))}</strong><small>${escape(variantCaption(item))}</small></td><td>${escape(number(item.variant.coolingCapacityKw))} kW</td><td><strong>${escape(money(item.price))}</strong>${item.defaultColors ? `<small>Cena bazowa. ${escape(colorPriceNote(item))}</small>` : ''}</td></tr>`).join('')}</tbody></table>
    ${offer.items.length <= 5 && offer.priorities.additional.length <= 3 ? comparisonNotes(offer) : ''}${offer.notes && offer.notes.length <= 350 ? `<div class="document-note">${escape(offer.notes)}</div>` : ''}
    <p class="document-terms">${escape(PRICING.pricingNote)}</p><p class="document-terms">${escape(PRICING.travelIncluded)}</p>`, 'summary-page');
}

const displayPriority = (offer: OfferDocument) => offer.priorities.main === 'general' ? offer.priorities.additional[0] ?? 'general' : offer.priorities.main;

function hero(item: OfferItem, offer: OfferDocument): [string, string] {
  const data = item.technicalData;
  switch (displayPriority(offer)) {
    case 'quiet': if (data.indoorNoise.minDb !== null) return ['Minimalny deklarowany hałas', `${number(data.indoorNoise.minDb)} dB(A)`]; break;
    case 'heating': case 'year-round': if (data.operatingRange.heatingMinC !== null) return ['Zakres pracy w ogrzewaniu', `do ${number(data.operatingRange.heatingMinC)}°C`]; break;
    case 'efficiency': if (data.seer !== null && data.scop !== null) return ['Sprawność sezonowa · SEER / SCOP', `${number(data.seer)} / ${number(data.scop)}`]; break;
    case 'heating-cost': { const result = offer.energy.get(item.id)?.heating; if (result) return ['Szacowany koszt ogrzewania / sezon', range(result.cost)]; break; }
    case 'cooling-cost': { const result = offer.energy.get(item.id)?.cooling; if (result) return ['Szacowany koszt chłodzenia / sezon', range(result.usageCost)]; break; }
    case 'design': return [item.defaultColors ? 'Wersje kolorystyczne' : 'Wybrany kolor / wersja', variantCaption(item)];
    case 'airflow': if (data.airflow.gentleCooling) return ['Komfort nawiewu', data.airflow.gentleCooling]; if (data.airflow.directions) return ['Kierunki nawiewu', data.airflow.directions]; break;
    case 'air-quality': if (data.airQuality.uvc) return ['Jakość powietrza', 'Lampa UVC']; if (data.airQuality.filters?.length) return ['Filtracja', data.airQuality.filters[0]]; break;
  }
  return ['Cena z montażem', money(item.price)];
}

function productPages(offer: OfferDocument, item: OfferItem, index: number) {
  const features = [item.technicalData.controls.wifi && 'Sterowanie Wi-Fi', item.technicalData.airQuality.uvc && 'Lampa UVC', item.technicalData.airQuality.ionizer && 'Jonizator', item.technicalData.heatingFeatures.trayHeater && 'Grzałka tacy skroplin', item.technicalData.heatingFeatures.crankcaseHeater && 'Grzałka karteru', item.technicalData.airQuality.selfClean && 'Samooczyszczanie', item.technicalData.airflow.gentleCooling, item.technicalData.airflow.silentMode && 'Tryb cichy'].filter(Boolean).slice(0, 5);
  const skip = new Set(['productImages', 'priceFromPLN', 'colorAffectsPrice', 'design.colors', 'indoorNoise.context', 'outdoorNoise.context', 'outdoorNoise.soundPowerContext']);
  const selectedFields = getOfferPriorityFields(offer.priorities);
  const general: TechnicalFieldPath[] = ['coolingCapacityKw', 'heatingCapacityKw', 'coolingEnergyClass', 'heatingEnergyClass'];
  const focus = displayPriority(offer);
  // General offers keep noise, efficiency and capacity together, without repeating feature chips.
  if (offer.priorities.main === 'general') for (const [path, label] of [['airflow.silentMode', 'Tryb cichy'], ['airQuality.selfClean', 'Samooczyszczanie'], ['controls.wifi', 'Sterowanie Wi-Fi']]) {
    if (features.includes(label)) skip.add(path);
  }
  if (focus === 'quiet' && item.technicalData.indoorNoise.minDb !== null) skip.add('indoorNoise.minDb');
  if (focus === 'heating' || focus === 'year-round') skip.add('operatingRange.heatingMinC');
  if (focus === 'efficiency') for (const path of ['seer', 'scop']) skip.add(path);
  const essentials: TechnicalFieldPath[] = focus === 'heating' || focus === 'year-round' || focus === 'heating-cost'
    ? ['coolingCapacityKw', 'heatingCapacityKw', 'indoorNoise.minDb']
    : ['coolingCapacityKw', 'indoorNoise.minDb'];
  const fields = [...new Set<TechnicalFieldPath>([...essentials, ...selectedFields, ...(offer.priorities.main === 'general' ? general : [])])].filter(path => !skip.has(path) && (path === 'indoorNoise.minDb' || readPath(item.technicalData, path) !== null));
  const pageCapacity = focus === 'general' ? 10 : focus === 'design' ? 6 : 8;
  const chunk = fields.slice(0, pageCapacity);

  const [heroLabel, heroValue] = hero(item, offer);
  return page(offer, `Urządzenie ${index + 1} / ${offer.items.length}`,
    `<div class="recipient-line${offer.withoutCustomer ? ' without-customer' : ''}">${offer.withoutCustomer ? '' : `<div><small>PRZYGOTOWANO DLA</small><strong>${escape(offer.customer || 'Klient indywidualny')}</strong>${offer.location ? `<span>${escape(offer.location)}</span>` : ''}</div>`}<div><small>${escape(dateLabel(offer.date))}</small>${offer.validUntil ? `<span>Ważna do ${escape(dateLabel(offer.validUntil))}</span>` : ''}</div></div><p class="document-kicker">${escape(focus === 'price' ? priceFocusLabel(item) : priorityLabel(focus))}</p><div class="device-heading"><div><p class="device-brand">${escape(item.model.brandLabel)}</p><h2 class="document-title">${escape(item.model.product.ctaName ?? item.model.name)}</h2></div><span class="variant-label">${escape(item.variant.label)} <small>kW</small></span></div>
    <div class="product-showcase"><div class="product-visual">${productVisual(item)}</div><aside class="product-price-card"><span class="price-label">${item.defaultColors ? 'CENA BAZOWA Z MONTAŻEM' : 'URZĄDZENIE Z MONTAŻEM'}</span><strong class="offer-price">${escape(money(item.price))}</strong><span class="price-inclusion">Standardowy montaż<br>do ${PRICING.standardInstallationMeters} mb w cenie</span><div class="price-variant"><small>${item.defaultColors ? 'KOLORY DO WYBORU' : 'WYBRANY WARIANT'}</small><span>${escape(item.variant.label)} kW · ${escape(variantCaption(item))}</span></div>${item.defaultColors ? `<p class="color-price-note">${escape(colorPriceNote(item))}</p>` : ''}</aside></div>${heroLabel !== 'Cena z montażem' ? `<div class="device-hero"><div><small>${escape(heroLabel)}</small><strong>${escape(heroValue)}</strong></div><span class="price-secondary">${escape(item.technicalData.seer !== null ? `SEER ${number(item.technicalData.seer)}` : '')}<small>${escape(item.technicalData.scop !== null ? `SCOP ${number(item.technicalData.scop)}` : '')}</small></span></div>` : ''}
    <p class="spec-heading">Parametry wybranego wariantu</p><dl class="spec-grid">${chunk.map(path => `<div><dt>${escape(fieldInfo.get(path)![0])}</dt><dd>${escape(formatField(path, readPath(item.technicalData, path)))}</dd></div>`).join('')}</dl>
    ${features.length ? `<ul class="feature-list" aria-label="Funkcje urządzenia">${features.map(feature => `<li><strong>${escape(feature)}</strong><small>${escape(featureDescriptions[String(feature)] ?? 'Łagodniejszy nawiew')}</small></li>`).join('')}</ul>` : ''}
    ${offer.recommendation ? `<p class="selection-reason"><strong>Dlaczego ten model?</strong> Moc chłodnicza ${escape(number(item.variant.coolingCapacityKw))} kW pokrywa oszacowane ${escape(number(offer.recommendation.estimate.needKw))} kW. ${offer.recommendation.reasons[item.id].length ? `${escape(offer.recommendation.reasons[item.id].join(' · '))}. ` : ''}Założenia na stronie „Dlaczego taka moc?”.</p>` : ''}
    ${comparisonNotes(offer, item)}
    ${chunk.some(path => path.startsWith('indoorNoise.')) && item.technicalData.indoorNoise.context ? `<p class="acoustic-context">${escape(item.technicalData.indoorNoise.context)}</p>` : ''}
    ${chunk.some(path => path.startsWith('outdoorNoise.')) ? `<p class="acoustic-context">${escape([item.technicalData.outdoorNoise.context, item.technicalData.outdoorNoise.soundPowerContext].filter(Boolean).join(' '))} Ciśnienie i moc akustyczna to różne wielkości.</p>` : ''}
    ${item.conflictPaths.length ? '<p class="acoustic-context">Część danych katalogowych wymaga potwierdzenia. Zachowano wartości z konfiguracji FrigAC; sporne parametry pominięto w porównaniach i obliczeniach kosztów.</p>' : ''}
    <p class="document-terms">Cena obejmuje standardowy montaż do ${PRICING.standardInstallationMeters} mb; dodatkowy zakres wymaga uzgodnienia. Nominalna moc i minimalna temperatura pracy nie określają mocy dostępnej przy danej temperaturze zewnętrznej.</p>`, `${offer.priorities.main === 'design' ? 'design-focus' : focus === 'quiet' ? 'acoustics-focus' : ''}${offer.recommendation ? ' recommended-focus' : ''}`);
}

function energyPages(offer: OfferDocument) {
  if (!offer.energyInput) return '';
  const input = offer.energyInput;
  const modes = [offer.priorities.main, ...offer.priorities.additional];
  const heating = modes.includes('heating-cost');
  const cooling = modes.includes('cooling-cost');
  const batchSize = heating && cooling ? 3 : 6;
  const groups = inputValue('energy-layout') === 'per-device'
    ? offer.items.map(item => [item])
    : Array.from({ length: Math.ceil(offer.items.length / batchSize) }, (_, index) => offer.items.slice(index * batchSize, (index + 1) * batchSize));
  const assumptions = `${number(input.area)} m² · energia ${number(input.price)} zł/kWh · izolacja: ${HEATING_ASSUMPTIONS.heatLoadWm2[input.insulation].label.toLowerCase()}${cooling ? ` · chłodzenie: ${USAGE_PROFILES[input.coolingUsage].label.toLowerCase()}` : ''}${heating ? ` · ogrzewanie: ${HEATING_ASSUMPTIONS.usage[input.heatingUsage].label.toLowerCase()}` : ''}`;
  return groups.map(group => page(offer, 'Koszty energii', `<p class="document-kicker">WSPÓLNE ZAŁOŻENIA · KALKULATOR FRIGAC</p><h2 class="document-title">Koszty użytkowania.</h2><p class="energy-assumptions">${escape(assumptions)}</p>
    ${heating ? `<h3 class="energy-section-title">Ogrzewanie · sezon</h3><table class="offer-table"><thead><tr><th>Urządzenie</th><th>Energia elektryczna</th><th>Koszt sezonu</th></tr></thead><tbody>${group.map(item => { const data = offer.energy.get(item.id)!.heating; return `<tr><td><strong>${escape(itemName(item))}</strong><small>${escape(item.variant.label)} kW · ${escape(variantCaption(item))}</small></td><td>${data ? `${data.electricityKwh.map(formatEnergyNumber).join(' – ')} kWh` : 'Wymaga potwierdzenia danych'}</td><td>${data ? escape(range(data.cost)) : '—'}</td></tr>`; }).join('')}</tbody></table>` : ''}
    ${cooling ? `<h3 class="energy-section-title">Chłodzenie · sezon</h3><table class="offer-table"><thead><tr><th>Urządzenie</th><th>Energia elektryczna</th><th>Koszt sezonu</th></tr></thead><tbody>${group.map(item => { const data = offer.energy.get(item.id)!.cooling; return `<tr><td><strong>${escape(itemName(item))}</strong><small>${escape(item.variant.label)} kW · ${escape(variantCaption(item))}</small></td><td>${data ? `${data.usageKwh.map(formatEnergyNumber).join(' – ')} kWh` : 'Wymaga potwierdzenia danych'}</td><td>${data ? escape(range(data.usageCost)) : '—'}</td></tr>`; }).join('')}</tbody></table>` : ''}
    <div class="document-note">Szacunki orientacyjne z istniejącego kalkulatora FrigAC. Wyniki zależą od pomieszczenia, pogody, ustawień i sposobu użytkowania. Zakresy kosztów dotyczą każdego wariantu jako alternatywy dla tego samego pomieszczenia.</div>
    ${group.flatMap(item => offer.energy.get(item.id)!.warnings.filter(warning => (heating || !/ogrzew/i.test(warning)) && (cooling || !/chłodze/i.test(warning))).map(warning => `<p class="document-terms">${escape(itemIdentity(item))}: ${escape(warning)}</p>`)).join('')}
    ${heating ? '<p class="document-terms">Koszt ogrzewania wynika z zapotrzebowania pomieszczenia i SCOP. Przy mrozie dobór wymaga analizy strat ciepła oraz wydajności urządzenia przy temperaturze projektowej.</p>' : ''}`)).join('');
}

function sizingPage(offer: OfferDocument) {
  if (!offer.recommendation) return '';
  const { room, estimate, warnings } = offer.recommendation;
  return page(offer, 'Założenia doboru', `<p class="document-kicker">DOBÓR DO POMIESZCZENIA</p><h2 class="document-title">Dlaczego taka moc?</h2><p class="document-lead">${escape(number(room.area))} m² · ${escape(number(estimate.volume))} m³ · jedna strefa chłodzenia</p>
    <div class="device-hero"><div><small>Szacowane zapotrzebowanie na chłodzenie</small><strong>${escape(number(estimate.needKw))} kW</strong></div><span class="price-secondary">Propozycje: ${offer.items.length}<small>alternatywne modele</small></span></div>
    <h3>Wymiary i kubatura</h3><p class="sizing-copy">${room.sloped ? `Wysokość minimalna ${escape(number(room.minHeight))} m, maksymalna ${escape(number(room.height))} m. Skosy obejmują ${escape(number(room.slopePercent))}% podłogi. Średnia wysokość części skośnej: (${escape(number(room.minHeight))} + ${escape(number(room.height))}) / 2. Pozostała część ma pełną wysokość.` : `Wysokość pomieszczenia: ${escape(number(room.height))} m, bez skosów.`}<br>Średnia wysokość całego pomieszczenia: ${escape(number(estimate.averageHeight))} m. Kubatura: ${escape(number(room.area))} m² × ${escape(number(estimate.averageHeight))} m = ${escape(number(estimate.volume))} m³.</p>
    <h3>Założenia obciążenia cieplnego</h3><table class="offer-table"><thead><tr><th>Czynnik</th><th>Przyjęta korekta</th></tr></thead><tbody>${estimate.adjustments.map(adjustment => `<tr><td>${escape(adjustment.label)}</td><td>${adjustment.value > 0 ? '+' : ''}${escape(number(adjustment.value * 100))}%</td></tr>`).join('')}<tr><td>Osoby: ${room.occupants} (baza obejmuje 2 osoby)</td><td>+ ${escape(number(estimate.peopleKw))} kW</td></tr><tr><td>Dodatkowe ciepło ze sprzętu: ${escape(number(room.equipmentW))} W</td><td>+ ${escape(number(estimate.equipmentKw))} kW</td></tr></tbody></table>
    <div class="document-note">${escape(number(estimate.volume))} m³ × 40 W/m³ ÷ 1000 × ${escape(number(1 + estimate.correction))} + ${escape(number(estimate.peopleKw))} kW + ${escape(number(estimate.equipmentKw))} kW ≈ ${escape(number(estimate.needKw))} kW.<br>Wynik zaokrąglono w górę do 0,1 kW. Dla każdej serii wybrano najmniejszy dostępny i wyceniony wariant pokrywający ten wynik, z ograniczeniem nadmiernego przewymiarowania.</div>
    <p class="sizing-copy">${visiblePriorityLabels(offer).length ? `Uwzględnione potrzeby: ${escape(visiblePriorityLabels(offer).join(' · '))}. ` : ''}${!room.brand || room.brand === 'all' ? 'Porównujemy GREE i KAISAI; od dwóch propozycji uwzględniamy obie marki, jeśli spełniają wymagania. ' : `Marka: ${room.brand.toUpperCase()}. `}${room.requireUvc ? 'Uwzględniono wyłącznie modele z potwierdzoną lampą UVC. ' : ''}${room.maxPrice !== null ? `Limit ceny bazowej z montażem: ${escape(money(room.maxPrice))}. ` : ''}Każdy model stanowi alternatywę dla tej samej strefy; mocy urządzeń nie sumujemy.</p>
    ${warnings.map(warning => `<p class="document-terms">${escape(warning)}</p>`).join('')}
    <p class="document-terms">Dobór wstępny według kubatury i jawnych korekt FrigAC, nie pełny bilans cieplny budynku. Złożona geometria dachu, wentylacja, intensywne gotowanie i nietypowe zyski ciepła wymagają oceny na miejscu. Moc grzewczą przy mrozie należy zweryfikować osobno.</p>`, 'sizing-page');
}

function prepareOffer() {
  previewVersion++;
  const selected = priorities();
  const recommendation = automaticSelection() ? recommendOffer(readRoom(), selected) : null;
  const items = recommendation?.items ?? resolveOfferItems([...rows.querySelectorAll<HTMLElement>('.device-row')].map(readSelection));
  const needsEnergy = [selected.main, ...selected.additional].some(id => id === 'heating-cost' || id === 'cooling-cost');
  const energyInput = needsEnergy ? {
    area: Number(inputValue('energy-area')), price: Number(inputValue('energy-price')),
    insulation: inputValue('energy-insulation') as OfferEnergyInput['insulation'],
    coolingUsage: inputValue('cooling-usage') as OfferEnergyInput['coolingUsage'],
    heatingUsage: inputValue('heating-usage') as OfferEnergyInput['heatingUsage']
  } : null;
  const date = inputValue('offer-date');
  let validUntil: string | null = null;
  if (byId<HTMLInputElement>('include-validity').checked) {
    const expiry = new Date(`${date}T12:00:00Z`);
    expiry.setUTCDate(expiry.getUTCDate() + Number(inputValue('valid-days')));
    validUntil = expiry.toISOString().slice(0, 10);
  }
  const offer: OfferDocument = {
    recommendation,
    withoutCustomer: byId<HTMLInputElement>('without-customer').checked,
    customer: byId<HTMLInputElement>('without-customer').checked ? '' : inputValue('customer'), location: byId<HTMLInputElement>('without-customer').checked ? '' : inputValue('location'), reference: inputValue('offer-number'), date, validUntil, notes: inputValue('offer-notes'),
    priorities: selected, items, energyInput, energy: new Map(items.map(item => [item.id, energyInput ? calculateOfferEnergy(item, energyInput) : {cooling:null,heating:null,notes:[],warnings:[],conflictPaths:[]}]))
  };
  const comparisonsPage = (offer.items.length > 5 || offer.priorities.additional.length > 3) && calculateOfferComparisons(items).length
    ? page(offer, 'Porównanie urządzeń', `<p class="document-kicker">WYBRANY ZESTAW URZĄDZEŃ</p><h2 class="document-title">Porównanie wariantów.</h2>${comparisonNotes(offer)}<p class="document-terms">Porównanie obejmuje wyłącznie wybrane warianty. Brakujące lub sporne dane wyłączają porównanie danego parametru. Poziomy hałasu są deklaracjami producentów; warunki podano na stronach urządzeń.</p>`)
    : '';
  const includeSummary = byId<HTMLInputElement>('include-summary').checked;
  preview.innerHTML = (includeSummary ? cover(offer) + comparisonsPage : '') + items.map((item, index) => productPages(offer, item, index)).join('') + sizingPage(offer) + energyPages(offer) + (offer.notes && (!includeSummary || offer.notes.length > 350) ? page(offer, 'Uzgodnienia', `<p class="document-kicker">ZAKRES OFERTY</p><h2 class="document-title">Ustalenia i uwagi.</h2><div class="document-note">${escape(offer.notes)}</div>`) : '');
  const pageNumbers = preview.querySelectorAll<HTMLElement>('.document-page-number');
  pageNumbers.forEach((element, index) => { element.textContent = `Strona ${index + 1} z ${pageNumbers.length}`; });
  if (recommendation) {
    const result = byId('auto-selection-result');
    result.hidden = false;
    result.innerHTML = `<strong>Dobrano ${items.length} z ${recommendation.room.count} propozycji · szacowane ${escape(number(recommendation.estimate.needKw))} kW</strong><p>${items.map(item => escape(itemIdentity(item))).join(' · ')}</p>${recommendation.warnings.map(warning => `<p>${escape(warning)}</p>`).join('')}`;
  }
  byId('preview-heading').hidden = false;
  printButton.disabled = false;
  downloadButton.disabled = false;
  message.textContent = items.some(item => item.conflictPaths.length) ? 'Podgląd gotowy. Wybrane urządzenia mają parametry oznaczone do ręcznej weryfikacji w raporcie danych. Sporne pola nie tworzą porównań ani kosztów energii.' : 'Podgląd gotowy. Możesz zapisać ofertę jako PDF.';
  if (recommendation?.warnings.length) message.textContent += '\n' + recommendation.warnings.join('\n');
  document.title = `Oferta ${offer.reference || 'FrigAC'}${offer.customer ? ` — ${offer.customer}` : ''}`;
}

form.addEventListener('input', event => { if ((event.target as HTMLElement).id === 'pdf-filename') return; updateSelectionMode(); markDirty(); });
form.addEventListener('change', event => { if ((event.target as HTMLElement).id === 'pdf-filename') return; updatePriorities(); updateCustomerFields(); updateValidityField(); updateSelectionMode(); markDirty(); });
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  try { prepareOffer(); byId('preview-heading').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  catch (error) { message.textContent = error instanceof Error ? error.message : 'Nie udało się przygotować oferty.'; }
});
addButton.addEventListener('click', () => { addRow(); markDirty(); });
downloadButton.addEventListener('click', async () => {
  const version = previewVersion;
  if (!preview.children.length) return;
  const enteredName = inputValue('pdf-filename').replace(/\.pdf$/i, '');
  const defaultName = `Oferta_${inputValue('offer-number') || warsawDate()}`;
  const baseName = (enteredName || defaultName).replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100) || 'Oferta_FrigAC';
  downloadButton.disabled = true;
  try {
    await document.fonts.ready;
    await Promise.all([...preview.querySelectorAll<HTMLImageElement>('img')].map(image => image.decode()));
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    if (version !== previewVersion || !preview.children.length) return;
    document.body.classList.add('pdf-exporting');
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pages = [...preview.querySelectorAll<HTMLElement>('.offer-page')];
    for (const [index, pageElement] of pages.entries()) {
      if (version !== previewVersion) return;
      const canvas = await html2canvas(pageElement, { backgroundColor: '#ffffff', scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: -window.scrollY });
      const heightMm = canvas.height / canvas.width * 210;
      if (heightMm > 297.2 || pageElement.scrollHeight > pageElement.clientHeight + 1) throw new Error(`Strona ${index + 1} nie mieści się na A4.`);
      if (index) pdf.addPage('a4', 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, 210, heightMm, undefined, 'FAST');
    }
    if (version !== previewVersion) return;
    pdf.setProperties({ title: baseName, author: 'FrigAC', subject: 'Oferta klimatyzacji' });
    pdf.save(`${baseName}.pdf`);
  } catch (error) {
    message.textContent = `Nie udało się przygotować PDF: ${error instanceof Error ? error.message : 'spróbuj ponownie'}`;
  } finally {
    document.body.classList.remove('pdf-exporting');
    downloadButton.disabled = preview.children.length === 0;
  }
});
printButton.addEventListener('click', async () => {
  const version = previewVersion;
  if (!preview.children.length) return;
  printButton.disabled = true;
  try {
    await document.fonts.ready;
    await Promise.all([...preview.querySelectorAll<HTMLImageElement>('img')].map(image => image.decode()));
    if (version !== previewVersion || !preview.children.length) return;
    window.print();
  } catch { message.textContent = 'Nie udało się wczytać wszystkich zdjęć. Sprawdź połączenie i przygotuj podgląd ponownie.'; }
  finally { printButton.disabled = preview.children.length === 0; }
});

['gree-clivia', 'gree-airy', 'kaisai-geo-plus'].forEach(addRow);
updatePriorities();
