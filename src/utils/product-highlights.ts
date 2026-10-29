import type { EnergyVariant, LineupModel } from '../config/lineups.ts';
import { resolveTechnicalData } from './product-technical.ts';

const format = (value: number) => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 2 }).format(value);

export function variantHighlights(model: LineupModel, variant: EnergyVariant) {
  const data = resolveTechnicalData(model, variant);
  return {
    noiseDb: data.indoorNoise.minDb,
    noiseLabel: data.indoorNoise.minDb === null ? 'Brak danych' : `${format(data.indoorNoise.minDb)} dB(A)`,
    coolingClass: data.coolingEnergyClass,
    heatingClass: data.heatingEnergyClass,
    classLabel: data.coolingEnergyClass && data.heatingEnergyClass
      ? `${data.coolingEnergyClass} / ${data.heatingEnergyClass}` : 'Brak pełnych danych',
    heatingClimate: data.heatingClimate
  };
}
