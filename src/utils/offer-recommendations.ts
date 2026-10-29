import { ENERGY_MODELS } from '../config/lineups.ts';
import { POWER_CALCULATOR_CONFIG } from '../config/powerCalculator.ts';
import { normalizeOfferPriorities, type OfferPriorities, type OfferPriorityId } from '../config/offer-priorities.ts';
import { resolveOfferSelection, type OfferItem } from './offers.ts';

/** Preliminary cooling estimate. Coefficients and limits are documented in docs/offer-selection.md. */
export type RoomInput = {
  area: number; height: number; sloped: boolean; minHeight: number; slopePercent: number;
  sun: 'low' | 'standard' | 'high'; location: 'middle' | 'top'; glazing: 'no' | 'yes';
  insulation: 'good' | 'standard' | 'poor'; occupants: number; equipmentW: number;
  layout: 'open' | 'separate'; count: number; requireUvc: boolean; maxPrice: number | null;
  brand?: 'all' | 'gree' | 'kaisai';
};
export type RoomEstimate = {
  averageHeight: number; volume: number; baseKw: number; correction: number;
  peopleKw: number; equipmentKw: number; needKw: number;
  adjustments: Array<{ label: string; value: number }>;
};
export type RecommendedOffer = {
  room: RoomInput; estimate: RoomEstimate; items: OfferItem[];
  reasons: Record<string, string[]>; warnings: string[];
};
const inRange = (value: number, min: number, max: number) => Number.isFinite(value) && value >= min && value <= max;

export function estimateOfferRoom(room: RoomInput): RoomEstimate {
  if (!room || !inRange(room.area, 5, 200) || !inRange(room.height, 1.8, 6) ||
    !Number.isInteger(room.occupants) || !inRange(room.occupants, 1, 30) || !inRange(room.equipmentW, 0, 10000) ||
    !['open', 'separate'].includes(room.layout) || !Object.hasOwn(POWER_CALCULATOR_CONFIG.sun, room.sun) ||
    !Object.hasOwn(POWER_CALCULATOR_CONFIG.location, room.location) || !Object.hasOwn(POWER_CALCULATOR_CONFIG.glazing, room.glazing) ||
    !['good', 'standard', 'poor'].includes(room.insulation) || typeof room.sloped !== 'boolean') {
    throw new RangeError('Uzupełnij poprawne wymiary i warunki pomieszczenia.');
  }
  if (room.sloped && (!inRange(room.minHeight, 0.1, room.height) || !inRange(room.slopePercent, 1, 100))) {
    throw new RangeError('Podaj wysokość minimalną nie większą od maksymalnej oraz udział skosów od 1 do 100%.');
  }
  const fraction = room.sloped ? room.slopePercent / 100 : 0;
  const averageHeight = room.height * (1 - fraction) + (room.sloped ? (room.height + room.minHeight) / 2 * fraction : 0);
  const volume = room.area * averageHeight;
  const adjustments = [
    { label: `Nasłonecznienie: ${POWER_CALCULATOR_CONFIG.sun[room.sun].label.toLowerCase()}`, value: POWER_CALCULATOR_CONFIG.sun[room.sun].correction },
    { label: POWER_CALCULATOR_CONFIG.location[room.location].label, value: POWER_CALCULATOR_CONFIG.location[room.location].correction },
    { label: `Duże przeszklenia: ${POWER_CALCULATOR_CONFIG.glazing[room.glazing].label.toLowerCase()}`, value: POWER_CALCULATOR_CONFIG.glazing[room.glazing].correction },
    { label: `Izolacja: ${{ good: 'dobra', standard: 'standardowa', poor: 'słaba' }[room.insulation]}`, value: { good: -0.1, standard: 0, poor: 0.15 }[room.insulation] }
  ];
  const correction = adjustments.reduce((sum, item) => sum + item.value, 0);
  const baseKw = volume * 40 / 1000;
  const peopleKw = Math.max(0, room.occupants - 2) * 0.18;
  const equipmentKw = room.equipmentW / 1000;
  // Round upward only at the end; the selected capacity must cover this displayed target.
  const needKw = Math.ceil((baseKw * (1 + correction) + peopleKw + equipmentKw - 1e-9) * 10) / 10;
  return { averageHeight, volume, baseKw, correction, peopleKw, equipmentKw, needKw, adjustments };
}

function known(item: OfferItem, path: string, value: number | null | undefined): number | null {
  if (item.conflictPaths.some(field => {
    const normalized = field.replace(/^technicalData\./, '');
    return normalized === path || path.startsWith(normalized + '.') || normalized.startsWith(path + '.');
  })) return null;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
function feature(item: OfferItem, path: string, value: unknown) {
  return known(item, path, value === true || typeof value === 'string' && value.length > 0 || Array.isArray(value) && value.length > 0 ? 1 : 0) ?? 0;
}
function benefit(item: OfferItem, priority: OfferPriorityId): number | null {
  const d = item.technicalData;
  switch (priority) {
    case 'price': return -item.price;
    case 'quiet': { const noise = known(item, 'indoorNoise.minDb', d.indoorNoise.minDb); return noise === null ? null : -noise; }
    case 'heating-cost': return known(item, 'scop', d.scop);
    case 'cooling-cost': return known(item, 'seer', d.seer);
    case 'efficiency': { const a = known(item, 'seer', d.seer), b = known(item, 'scop', d.scop); return a === null || b === null ? null : a + b; }
    case 'air-quality': return 5 * feature(item, 'airQuality.uvc', d.airQuality.uvc) + feature(item, 'airQuality.ionizer', d.airQuality.ionizer) + feature(item, 'airQuality.filters', d.airQuality.filters) + feature(item, 'airQuality.selfClean', d.airQuality.selfClean);
    case 'airflow': return 3 * feature(item, 'airflow.gentleCooling', d.airflow.gentleCooling) + feature(item, 'airflow.directions', d.airflow.directions) + feature(item, 'airflow.silentMode', d.airflow.silentMode);
    case 'design': return d.design.colors?.length ?? null;
    case 'heating': case 'year-round': return (known(item, 'scop', d.scop) ?? 0) + feature(item, 'heatingFeatures.trayHeater', d.heatingFeatures.trayHeater) + feature(item, 'heatingFeatures.crankcaseHeater', d.heatingFeatures.crankcaseHeater);
    default: return known(item, 'seer', d.seer);
  }
}
function selectionReasons(item: OfferItem, priorities: OfferPriorities): string[] {
  const d = item.technicalData;
  const reasons: string[] = [];
  for (const priority of [priorities.main, ...priorities.additional]) {
    if (priority === 'air-quality') {
      if (feature(item, 'airQuality.uvc', d.airQuality.uvc)) reasons.push('Lampa UVC');
      else if (feature(item, 'airQuality.ionizer', d.airQuality.ionizer)) reasons.push('Jonizator');
    }
    if (priority === 'quiet' && known(item, 'indoorNoise.minDb', d.indoorNoise.minDb) !== null) reasons.push(`Minimalny deklarowany hałas ${d.indoorNoise.minDb} dB(A)`);
    if (['heating', 'year-round', 'heating-cost'].includes(priority) && known(item, 'scop', d.scop) !== null) reasons.push(`SCOP ${d.scop}`);
    if (['general', 'efficiency', 'cooling-cost'].includes(priority) && known(item, 'seer', d.seer) !== null) reasons.push(`SEER ${d.seer}`);
    if (priority === 'airflow' && feature(item, 'airflow.gentleCooling', d.airflow.gentleCooling)) reasons.push(String(d.airflow.gentleCooling));
    if (priority === 'design' && d.design.colors?.length) reasons.push(`${d.design.colors.length} wersji kolorystycznych`);
  }
  return [...new Set(reasons)].slice(0, 2);
}

export function recommendOffer(room: RoomInput, requestedPriorities: OfferPriorities): RecommendedOffer {
  const estimate = estimateOfferRoom(room);
  if (!Number.isInteger(room.count) || !inRange(room.count, 1, 8) || typeof room.requireUvc !== 'boolean' ||
    room.maxPrice !== null && !inRange(room.maxPrice, 1, 100000)) throw new RangeError('Wybierz od 1 do 8 propozycji i poprawny budżet.');
  if (room.layout === 'separate') throw new RangeError('Oddzielne pokoje wymagają osobnego doboru dla każdej strefy. Podaj dane jednego pomieszczenia albo przejdź do wyboru ręcznego.');
  if (room.area > 70 || room.height > 4.5 || estimate.needKw > 7) throw new RangeError(`Szacowane zapotrzebowanie: ${estimate.needKw.toFixed(1)} kW. Ten metraż, wysokość lub obciążenie wymaga indywidualnego doboru. Użyj trybu ręcznego po weryfikacji instalatora.`);
  const brand = room.brand ?? 'all';
  if (!['all', 'gree', 'kaisai'].includes(brand)) throw new RangeError('Wybierz poprawną markę urządzeń.');
  const priorities = normalizeOfferPriorities(requestedPriorities.main, requestedPriorities.additional);
  const maxCapacity = Math.max(estimate.needKw * 1.35, estimate.needKw + 0.5);
  const candidates = ENERGY_MODELS.filter(model => !model.unavailable && (brand === 'all' || model.slug.startsWith(brand + '-'))).flatMap(model => {
    const variants = model.variants.flatMap(variant => {
      try {
        const item = resolveOfferSelection({ modelSlug: model.slug, powerKw: variant.powerKw });
        const capacity = known(item, 'coolingCapacityKw', item.technicalData.coolingCapacityKw);
        if (capacity === null || capacity < estimate.needKw || capacity > maxCapacity || room.maxPrice !== null && item.price > room.maxPrice ||
          room.requireUvc && !feature(item, 'airQuality.uvc', item.technicalData.airQuality.uvc)) return [];
        return [item];
      } catch { return []; }
    }).sort((a, b) => a.variant.coolingCapacityKw - b.variant.coolingCapacityKw || a.price - b.price);
    return variants.slice(0, 1);
  });
  if (!candidates.length) throw new RangeError(`Brak modeli spełniających jednocześnie moc około ${estimate.needKw.toFixed(1)} kW, budżet i wymagane funkcje. Zmień wymagania lub wybierz urządzenia ręcznie; nie dodano niepasujących modeli.`);
  const weights = new Map<OfferPriorityId, number>();
  const add = (id: OfferPriorityId, weight: number) => weights.set(id, (weights.get(id) ?? 0) + weight);
  if (priorities.main === 'general') { add('quiet', 1); add('efficiency', 1); add('price', 1); }
  else add(priorities.main, 3);
  priorities.additional.forEach(priority => add(priority, 1));
  const scores = new Map(candidates.map(item => [item.id, 0]));
  for (const [priority, weight] of weights) {
    const values = candidates.map(item => benefit(item, priority));
    const available = values.filter((value): value is number => value !== null);
    const min = Math.min(...available), max = Math.max(...available);
    candidates.forEach((item, index) => {
      const value = values[index];
      const normalized = value === null ? 0 : max === min ? 1 : (value - min) / (max - min);
      scores.set(item.id, scores.get(item.id)! + normalized * weight);
    });
  }
  const compare = (a: OfferItem, b: OfferItem) => scores.get(b.id)! - scores.get(a.id)! || a.variant.coolingCapacityKw - b.variant.coolingCapacityKw || a.price - b.price || a.model.slug.localeCompare(b.model.slug);
  const ranked = candidates.sort(compare);
  let items = ranked.slice(0, room.count);
  // Both brands are represented only from the pool that already passes every hard requirement.
  if (brand === 'all' && room.count >= 2) {
    for (const prefix of ['gree-', 'kaisai-']) {
      const best = ranked.find(item => item.model.slug.startsWith(prefix));
      if (best && !items.some(item => item.model.slug.startsWith(prefix))) items = [...items.slice(0, -1), best].sort(compare);
    }
  }
  const warnings = [];
  if (items.length < room.count) warnings.push(`Znaleziono ${items.length} z ${room.count} propozycji spełniających wymagania. Pokazano wyłącznie pasujące modele.`);
  if (brand === 'all') {
    for (const [prefix, label] of [['gree-', 'GREE'], ['kaisai-', 'KAISAI']]) {
      if (!ranked.some(item => item.model.slug.startsWith(prefix))) warnings.push(`${label}: brak modelu spełniającego jednocześnie moc, budżet i wymagane funkcje.`);
    }
  }
  if ([priorities.main, ...priorities.additional].some(id => ['heating', 'heating-cost', 'year-round'].includes(id))) warnings.push('Moc dobrano do chłodzenia. Parametry grzania wpływają na kolejność propozycji; ogrzewanie jako główne źródło wymaga obliczenia strat ciepła i wydajności przy mrozie.');
  return { room, estimate, items, reasons: Object.fromEntries(items.map(item => [item.id, [...selectionReasons(item, priorities), ...(room.requireUvc && !selectionReasons(item, priorities).includes('Lampa UVC') ? ['Wymagana lampa UVC'] : [])].slice(0, 2)])), warnings };
}
