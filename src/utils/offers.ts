import { ENERGY_MODELS } from '../config/lineups.ts';
import type { TechnicalFieldPath } from '../config/product-technical.ts';
import { getProductColors, resolveTechnicalData, type ResolvedProductColor, type ResolvedTechnicalData } from './product-technical.ts';
import { calculateEnergyEstimate, calculateHeatingEstimate, HEATING_ASSUMPTIONS, USAGE_PROFILES } from './energy-estimate.mjs';

export const MAX_OFFER_ITEMS = 8;
export type OfferSelection = { modelSlug: string; powerKw: number; colorName?: string | null };
export type OfferItem = {
  id: string;
  model: typeof ENERGY_MODELS[number];
  variant: typeof ENERGY_MODELS[number]['variants'][number];
  color: ResolvedProductColor | null;
  defaultColors: boolean;
  colorPrices: Array<{ name: string; price: number | null; difference: number | null }>;
  technicalData: ResolvedTechnicalData;
  price: number;
  image: string;
  conflictPaths: string[];
};

/** Every selection is re-resolved from the central catalog; client-provided prices are ignored. */
export function resolveOfferSelection(selection: OfferSelection): OfferItem {
  if (!selection || typeof selection !== 'object' || typeof selection.modelSlug !== 'string' || !Number.isFinite(selection.powerKw)) {
    throw new RangeError('Wybierz poprawny model i moc urządzenia.');
  }
  const model = ENERGY_MODELS.find((entry) => entry.slug === selection.modelSlug);
  if (!model || model.unavailable) throw new RangeError('Model jest niedostępny lub nie istnieje w aktualnej ofercie.');
  const variant = model.variants.find((entry) => entry.powerKw === selection.powerKw);
  if (!variant) throw new RangeError(`Nieznana moc modelu ${model.name}.`);
  const colors = getProductColors(model);
  const selectedName = selection.colorName ?? null;
  if (selectedName !== null && typeof selectedName !== 'string') throw new RangeError('Niepoprawny kolor urządzenia.');
  const defaultColors = !selectedName && colors.length > 1;
  const color = selectedName ? colors.find((entry) => entry.name === selectedName) : colors.length === 1 ? colors[0] : null;
  if (selectedName && !color) throw new RangeError(`Nieznany kolor modelu ${model.name}.`);
  if (color && !color.image) throw new RangeError(`Brak zdjęcia przypisanego do koloru ${color.name}.`);
  const technicalData = resolveTechnicalData(model, variant, color ?? undefined);
  const price = technicalData.priceFromPLN;
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) throw new RangeError('Brak aktualnej ceny wybranego wariantu mocy i koloru.');
  const defaultFront = colors.find(entry => entry.name === 'Biały' && entry.image) ?? colors.find(entry => !entry.priceTier && entry.image) ?? colors.find(entry => entry.image);
  const image = color?.image ?? (defaultColors ? defaultFront?.image : null) ?? model.image;
  if (typeof image !== 'string' || !image.trim()) throw new RangeError('Brak zdjęcia wybranego urządzenia.');
  return {
    id: JSON.stringify([model.slug, variant.powerKw, color?.name ?? null]),
    model, variant, color: color ?? null, defaultColors, technicalData, price, image,
    colorPrices: colors.map(entry => {
      const amount = resolveTechnicalData(model, variant, entry).priceFromPLN;
      const known = typeof amount === 'number' && Number.isFinite(amount) && amount > 0 ? amount : null;
      return { name: entry.name, price: known, difference: known === null ? null : known - price };
    }),
    conflictPaths: [...new Set([...(model.technicalDataConflicts ?? []), ...(variant.technicalDataConflicts ?? [])])]
  };
}

export function resolveOfferItems(selections: OfferSelection[]): OfferItem[] {
  if (!Array.isArray(selections) || selections.length < 1 || selections.length > MAX_OFFER_ITEMS) {
    throw new RangeError(`Oferta musi zawierać od 1 do ${MAX_OFFER_ITEMS} urządzeń.`);
  }
  const items = selections.map(resolveOfferSelection);
  if (new Set(items.map((item) => item.id)).size !== items.length) throw new RangeError('Ten sam wariant urządzenia został wybrany więcej niż raz.');
  return items;
}

function hasConflict(item: OfferItem, path: TechnicalFieldPath): boolean {
  return item.conflictPaths.some((conflict) => {
    const normalized = conflict.replace(/^technicalData\./, '');
    return normalized === path || path.startsWith(`${normalized}.`) || normalized.startsWith(`${path}.`);
  });
}

export type OfferComparison = {
  metric: 'noise' | 'scop' | 'price' | 'colors';
  label: string;
  value: number;
  winnerIds: string[];
  unit?: string;
};

/** Extrema concern this selection only. Missing or disputed values suppress the whole metric. */
export function calculateOfferComparisons(items: OfferItem[]): OfferComparison[] {
  if (items.length < 2) return [];
  const definitions: Array<{
    metric: OfferComparison['metric']; path: TechnicalFieldPath; direction: 'min' | 'max';
    label: string; tiedLabel: string; unit?: string; read: (item: OfferItem) => number | null;
  }> = [
    { metric: 'noise', path: 'indoorNoise.minDb', direction: 'min', label: 'Najniższy deklarowany poziom hałasu w wybranym zestawieniu.', tiedLabel: 'Wspólnie najniższy deklarowany poziom hałasu w wybranym zestawieniu.', unit: 'dB(A)', read: (item) => item.technicalData.indoorNoise.minDb },
    { metric: 'scop', path: 'scop', direction: 'max', label: 'Najwyższy SCOP spośród wybranych urządzeń.', tiedLabel: 'Wspólnie najwyższy SCOP spośród wybranych urządzeń.', read: (item) => item.technicalData.scop },
    { metric: 'price', path: 'priceFromPLN', direction: 'min', label: 'Najniższa cena spośród wybranych wariantów.', tiedLabel: 'Wspólnie najniższa cena spośród wybranych wariantów.', unit: 'zł', read: (item) => item.price },
    { metric: 'colors', path: 'design.colors', direction: 'max', label: 'Najszerszy wybór kolorów w wybranym zestawieniu.', tiedLabel: 'Wspólnie najszerszy wybór kolorów w wybranym zestawieniu.', read: (item) => {
      const colors = item.technicalData.design.colors;
      return Array.isArray(colors) && colors.length > 0 ? new Set(colors).size : null;
    } }
  ];
  return definitions.flatMap((definition) => {
    if (items.some((item) => hasConflict(item, definition.path))) return [];
    const values = items.map(definition.read);
    if (values.some((value) => value === null || !Number.isFinite(value))) return [];
    const knownValues = values as number[];
    const value = definition.direction === 'min' ? Math.min(...knownValues) : Math.max(...knownValues);
    const winnerIds = items.filter((_, index) => knownValues[index] === value).map((item) => item.id);
    return [{ metric: definition.metric, label: winnerIds.length > 1 ? definition.tiedLabel : definition.label, value, winnerIds, ...(definition.unit ? { unit: definition.unit } : {}) }];
  });
}

export type OfferEnergyInput = {
  area: number;
  price: number;
  insulation: keyof typeof HEATING_ASSUMPTIONS.heatLoadWm2;
  coolingUsage: keyof typeof USAGE_PROFILES;
  heatingUsage: keyof typeof HEATING_ASSUMPTIONS.usage;
};
export type OfferEnergyResult = {
  cooling: ReturnType<typeof calculateEnergyEstimate> | null;
  heating: ReturnType<typeof calculateHeatingEstimate> | null;
  notes: string[];
  warnings: string[];
  conflictPaths: string[];
};

/** Existing calculator functions own all energy formulas and capacity-fit warnings. */
export function calculateOfferEnergy(item: OfferItem, input: OfferEnergyInput): OfferEnergyResult {
  if (!input || !Number.isFinite(input.area) || input.area <= 0 || !Number.isFinite(input.price) || input.price < 0 ||
    !Object.hasOwn(HEATING_ASSUMPTIONS.heatLoadWm2, input.insulation) || !Object.hasOwn(USAGE_PROFILES, input.coolingUsage) || !Object.hasOwn(HEATING_ASSUMPTIONS.usage, input.heatingUsage)) {
    throw new RangeError('Podaj poprawną powierzchnię, cenę energii, izolację i sposób użytkowania.');
  }
  const data = item.technicalData;
  const notes = [
    'Szacunek orientacyjny z kalkulatora energii FrigAC; założenia pomieszczenia i cena energii są wspólne dla wybranych urządzeń.',
    'Koszt ogrzewania wynika z zapotrzebowania pomieszczenia i SCOP; minimalna temperatura pracy nie potwierdza wydajności grzewczej przy mrozie.'
  ];
  const warnings: string[] = [];
  const required = { cooling: ['coolingCapacityKw', 'seer'], heating: ['heatingCapacityKw', 'scop'] } as const;
  const validMode = (mode: keyof typeof required): boolean => {
    const missing = required[mode].filter((path) => typeof data[path] !== 'number' || !Number.isFinite(data[path]) || data[path]! <= 0);
    const disputed = required[mode].filter((path) => hasConflict(item, path));
    if (missing.length) warnings.push(`Pominięto koszt ${mode === 'cooling' ? 'chłodzenia' : 'ogrzewania'}: brak danych ${missing.join(', ')}.`);
    if (disputed.length) warnings.push(`Pominięto koszt ${mode === 'cooling' ? 'chłodzenia' : 'ogrzewania'}: konflikt danych ${disputed.join(', ')}.`);
    return missing.length === 0 && disputed.length === 0;
  };
  const cooling = validMode('cooling') ? calculateEnergyEstimate({ power: data.coolingCapacityKw!, seer: data.seer!, area: input.area, price: input.price, usage: input.coolingUsage, insulation: input.insulation }) : null;
  const heating = validMode('heating') ? calculateHeatingEstimate({ heatingCapacityKw: data.heatingCapacityKw!, scop: data.scop!, area: input.area, price: input.price, usage: input.heatingUsage, insulation: input.insulation }) : null;
  if (cooling && cooling.capacityStatus !== 'adequate') warnings.push('Wydajność chłodzenia wymaga sprawdzenia dla podanej powierzchni i izolacji.');
  if (heating?.requiresIndividualSelection) warnings.push('Ogrzewanie wymaga indywidualnego doboru mocy do strat ciepła pomieszczenia.');
  return { cooling, heating, notes, warnings, conflictPaths: [...item.conflictPaths] };
}
