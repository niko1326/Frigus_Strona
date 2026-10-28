import { PRICING } from './site.ts';
import { ENERGY_MODELS } from './lineups.ts';

import { createCostCalculator } from '../utils/cost-estimate.ts';
export type { CostRange, DevicePriority, CostEstimateInput, RoomEstimate, CostEstimate, CostCalculatorConfig } from '../utils/cost-estimate.ts';

const getLowestVariantPrice = (minPowerKw: number, maxPowerKw: number): number => {
  const prices = ENERGY_MODELS.flatMap((model) => model.variants.flatMap((variant) =>
    variant.powerKw >= minPowerKw &&
    variant.powerKw <= maxPowerKw &&
    typeof variant.priceFromPLN === 'number'
      ? [variant.priceFromPLN]
      : []
  ));

  if (prices.length === 0) {
    throw new Error(`Brak ceny wariantu dla zakresu mocy ${minPowerKw}-${maxPowerKw} kW.`);
  }

  return Math.min(...prices);
};

const ENTRY_PRICES = {
  small: getLowestVariantPrice(2.5, 2.7),
  medium: getLowestVariantPrice(3.1, 3.6),
  large: getLowestVariantPrice(4.6, 5.4),
  extraLarge: getLowestVariantPrice(6.2, 7.2)
} as const;

export const COST_CALCULATOR_CONFIG = {
  roomArea: { min: 10, max: 100, step: 1 },
  defaultInstallationMeters: PRICING.standardInstallationMeters,
  standardInstallationMeters: PRICING.standardInstallationMeters,
  maxInstallationMeters: 15,
  extraMeter: { low: PRICING.extraInstallationMeterFromPLN, high: 150 },
  roundTo: 50,
  multiRoomUpperBufferPerAdditionalRoom: 500,
  powerBands: [
    { maxArea: 25, powerKw: '2,5', price: { low: ENTRY_PRICES.small, high: 4500 } },
    { maxArea: 35, powerKw: '3,5', price: { low: ENTRY_PRICES.medium, high: 4500 } },
    { maxArea: 50, powerKw: '5,0', price: { low: ENTRY_PRICES.large, high: 6000 } },
    { maxArea: 70, powerKw: '7,0', price: { low: ENTRY_PRICES.extraLarge, high: 7500 } }
  ],
  priorities: {
    price: { label: 'Najlepsza cena', adjustment: { low: 0, high: 0 } },
    comfort: { label: 'Komfort i cisza', adjustment: { low: 400, high: 1200 } },
    heating: { label: 'Głównie do grzania', adjustment: { low: 0, high: 800 } },
    unsure: { label: 'Nie wiem', adjustment: { low: 0, high: 600 } }
  }
} as const;

export const { getRoomEstimate, calculateCostEstimate } = createCostCalculator(COST_CALCULATOR_CONFIG);
