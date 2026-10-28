import type { TechnicalFieldPath } from './product-technical.ts';

export const DEFAULT_OFFER_PRIORITY = 'general' as const;

/** Kolejność parametrów steruje ekspozycją danych; nie stanowi oceny urządzenia. */
export const OFFER_PRIORITIES = [
  {
    id: 'general', label: 'Oferta ogólna', description: 'Cena, hałas, energia, ogrzewanie i najważniejsze funkcje.',
    fields: ['priceFromPLN', 'indoorNoise.minDb', 'seer', 'scop', 'operatingRange.heatingMinC', 'airflow.silentMode', 'airQuality.selfClean', 'controls.wifi']
  },
  {
    id: 'quiet', label: 'Cicha praca', description: 'Deklarowane ciśnienie akustyczne, warunki pomiaru i tryby pracy.',
    fields: ['indoorNoise.minDb', 'indoorNoise.maxDb', 'indoorNoise.levelsDb', 'indoorNoise.context', 'airflow.silentMode', 'airflow.fanSpeeds', 'airflow.nightMode', 'outdoorNoise.soundPressureDb', 'outdoorNoise.soundPowerDb', 'outdoorNoise.context']
  },
  {
    id: 'heating', label: 'Ogrzewanie', description: 'Wydajność grzania, SCOP, zakres temperatur i wyposażenie zimowe.',
    fields: ['heatingCapacityKw', 'scop', 'heatingEnergyClass', 'heatingClimate', 'operatingRange.heatingMinC', 'operatingRange.heatingMaxC', 'modulation.heatingMinKw', 'modulation.heatingMaxKw', 'heatingFeatures.trayHeater', 'heatingFeatures.crankcaseHeater', 'heatingFeatures.compressorWindingHeating', 'heatingFeatures.lowTempPerformance']
  },
  {
    id: 'efficiency', label: 'Energooszczędność', description: 'Sprawność sezonowa oraz klasy wybranego wariantu mocy.',
    fields: ['seer', 'scop', 'coolingEnergyClass', 'heatingEnergyClass', 'heatingClimate', 'ratedInput.coolingKw', 'ratedInput.heatingKw']
  },
  {
    id: 'heating-cost', label: 'Koszt ogrzewania', description: 'Szacunek z istniejącego kalkulatora przy wspólnych założeniach.',
    fields: ['heatingCapacityKw', 'scop', 'heatingEnergyClass', 'heatingClimate', 'operatingRange.heatingMinC']
  },
  {
    id: 'cooling-cost', label: 'Koszt chłodzenia', description: 'Szacunek z istniejącego kalkulatora przy wspólnych założeniach.',
    fields: ['coolingCapacityKw', 'seer', 'coolingEnergyClass', 'ratedInput.coolingKw']
  },
  {
    id: 'price', label: 'Cena', description: 'Aktualna cena dokładnie wybranego wariantu mocy i koloru.',
    fields: ['priceFromPLN', 'colorAffectsPrice', 'coolingCapacityKw', 'heatingCapacityKw']
  },
  {
    id: 'airflow', label: 'Komfort nawiewu', description: 'Kierunki, regulacja, łagodny nawiew i tryb nocny.',
    fields: ['airflow.gentleCooling', 'airflow.directions', 'airflow.fanSpeeds', 'airflow.fanSpeedControl', 'airflow.nightMode', 'airflow.automaticLouvers', 'airflow.indirectAirflow', 'airflow.silentMode']
  },
  {
    id: 'air-quality', label: 'Jakość powietrza', description: 'Potwierdzone filtry, oczyszczanie i higiena wymiennika.',
    fields: ['airQuality.ionizer', 'airQuality.uvc', 'airQuality.filters', 'airQuality.selfClean', 'airQuality.autoDry', 'airQuality.sterilization', 'airQuality.sterilizationTempC', 'airQuality.dehumidification', 'airQuality.humidityControl']
  },
  {
    id: 'design', label: 'Design', description: 'Zdjęcia przypisane do kolorów, wykończenie i wymiary.',
    fields: ['productImages', 'design.colors', 'design.finish', 'design.dimensions', 'colorAffectsPrice']
  },
  {
    id: 'year-round', label: 'Całoroczne użytkowanie', description: 'Parametry chłodzenia i ogrzewania oraz wyposażenie zimowe.',
    fields: ['coolingCapacityKw', 'heatingCapacityKw', 'seer', 'scop', 'operatingRange.coolingMinC', 'operatingRange.coolingMaxC', 'operatingRange.heatingMinC', 'heatingFeatures.trayHeater', 'heatingFeatures.crankcaseHeater', 'heatingFeatures.compressorWindingHeating', 'heatingFeatures.lowTempPerformance']
  }
] as const satisfies ReadonlyArray<{
  id: string; label: string; description: string; fields: readonly TechnicalFieldPath[];
}>;

export type OfferPriorityId = typeof OFFER_PRIORITIES[number]['id'];
export type OfferPriorities = { main: OfferPriorityId; additional: OfferPriorityId[] };

export function isOfferPriorityId(value: unknown): value is OfferPriorityId {
  return typeof value === 'string' && OFFER_PRIORITIES.some((item) => item.id === value);
}

export function normalizeOfferPriorities(main?: unknown, additional?: unknown): OfferPriorities {
  const selectedMain = isOfferPriorityId(main) ? main : DEFAULT_OFFER_PRIORITY;
  const selectedAdditional = Array.isArray(additional) ? additional : [];
  return {
    main: selectedMain,
    additional: [...new Set(selectedAdditional.filter(isOfferPriorityId))].filter((id) => id !== selectedMain)
  };
}

export function getOfferPriorityFields(priorities: OfferPriorities): TechnicalFieldPath[] {
  const normalized = normalizeOfferPriorities(priorities.main, priorities.additional);
  return [...new Set([normalized.main, ...normalized.additional].flatMap((id) =>
    [...OFFER_PRIORITIES.find((item) => item.id === id)!.fields]
  ))];
}
