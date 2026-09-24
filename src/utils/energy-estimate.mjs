// Reference cooling season: Regulation (EU) 626/2011, Annex VII, Table 4.
// Nominal cooling capacity is used as an approximation of Pdesignc.
export const COOLING_REFERENCE_HOURS = 350;

export const USAGE_PROFILES = Object.freeze({
  occasional: {
    label: 'Sporadycznie',
    description: 'Głównie podczas największych upałów',
    min: 0.6,
    max: 0.9
  },
  standard: {
    label: 'Standardowo',
    description: 'Regularnie w ciepłe dni',
    min: 0.9,
    max: 1.3
  },
  intensive: {
    label: 'Intensywnie',
    description: 'Wiele godzin przez większość sezonu',
    min: 1.3,
    max: 2
  }
});

export const HEATING_ASSUMPTIONS = Object.freeze({
  heatLoadWm2: {
    good: {
      label: 'Dobrze',
      description: 'Nowy lub dobrze ocieplony budynek',
      min: 35,
      max: 55,
      seasonalMin: 45,
      seasonalMax: 75,
      coolingMin: 0.85,
      coolingMax: 1
    },
    standard: {
      label: 'Standardowo',
      description: 'Typowe ocieplone mieszkanie lub dom',
      min: 55,
      max: 80,
      seasonalMin: 75,
      seasonalMax: 120,
      coolingMin: 1,
      coolingMax: 1.12
    },
    poor: {
      label: 'Słabo',
      description: 'Starszy budynek lub większe straty ciepła',
      min: 80,
      max: 120,
      seasonalMin: 120,
      seasonalMax: 180,
      coolingMin: 1.12,
      coolingMax: 1.3
    }
  },
  usage: {
    supplemental: {
      label: 'Dogrzewanie',
      description: 'Głównie jesienią, wiosną i w chłodniejsze dni',
      min: 0.35,
      max: 0.55
    },
    regular: {
      label: 'Regularnie',
      description: 'Częste ogrzewanie w sezonie',
      min: 0.65,
      max: 0.9
    },
    primary: {
      label: 'Główne ogrzewanie',
      description: 'Klimatyzator ma odpowiadać za większość ogrzewania',
      min: 0.9,
      max: 1.1
    }
  }
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Reference cooling is capacity × 350 / SEER. The displayed range additionally
 * reflects the room load (80–120 W/m²) and the selected usage profile.
 * @param {{power: number, seer: number, area: number, price: number, usage: keyof typeof USAGE_PROFILES, insulation: keyof typeof HEATING_ASSUMPTIONS.heatLoadWm2}} input
 */
export function calculateEnergyEstimate({ power, seer, area, price, usage, insulation }) {
  const insulationProfile = HEATING_ASSUMPTIONS.heatLoadWm2[insulation];
  if (!Number.isFinite(price) || price < 0 || !Object.hasOwn(USAGE_PROFILES, usage) || !insulationProfile) {
    throw new RangeError('Podaj poprawną cenę energii i sposób użytkowania.');
  }
  if (!Number.isFinite(power) || power <= 0 || !Number.isFinite(seer) || seer <= 0 ||
      !Number.isFinite(area) || area <= 0) {
    throw new RangeError('Moc, SEER i powierzchnia muszą być dodatnimi liczbami.');
  }

  const referenceKwh = power * COOLING_REFERENCE_HOURS / seer;
  const roomLoadKw = [
    area * 0.08 * insulationProfile.coolingMin,
    area * 0.12 * insulationProfile.coolingMax
  ];
  const loadFactors = [
    clamp(roomLoadKw[0] / power, 0.55, 1.15),
    clamp(roomLoadKw[1] / power, 0.85, 1.5)
  ];
  const profile = USAGE_PROFILES[usage];
  const usageKwh = [
    referenceKwh * loadFactors[0] * profile.min,
    referenceKwh * loadFactors[1] * profile.max
  ];

  return {
    referenceKwh,
    seasonCost: referenceKwh * price,
    roomLoadKw,
    usageKwh,
    usageCost: usageKwh.map((energyKwh) => energyKwh * price),
    capacityStatus: power < roomLoadKw[0] ? 'insufficient' : power < roomLoadKw[1] ? 'borderline' : 'adequate'
  };
}

/**
 * Simplified heating estimate based on area, insulation and intended usage.
 * Seasonal heat demand is divided by the selected variant's SCOP. Peak heat
 * load is used only to give an approximate capacity-fit warning.
 * @param {{area: number, insulation: keyof typeof HEATING_ASSUMPTIONS.heatLoadWm2, usage: keyof typeof HEATING_ASSUMPTIONS.usage, scop: number, heatingCapacityKw: number, price: number}} input
 */
export function calculateHeatingEstimate({ area, insulation, usage, scop, heatingCapacityKw, price }) {
  const insulationProfile = HEATING_ASSUMPTIONS.heatLoadWm2[insulation];
  const usageProfile = HEATING_ASSUMPTIONS.usage[usage];
  if (!Number.isFinite(area) || area <= 0 || !Number.isFinite(scop) || scop <= 0 ||
      !Number.isFinite(heatingCapacityKw) || heatingCapacityKw <= 0 ||
      !Number.isFinite(price) || price < 0 || !insulationProfile || !usageProfile) {
    throw new RangeError('Podaj poprawne dane pomieszczenia, wariantu i ceny energii.');
  }

  const peakHeatKw = [insulationProfile.min, insulationProfile.max].map((loadWm2) =>
    area * loadWm2 / 1000
  );
  const seasonalHeatDemand = [
    area * insulationProfile.seasonalMin * usageProfile.min,
    area * insulationProfile.seasonalMax * usageProfile.max
  ];
  const electricityKwh = seasonalHeatDemand.map((heatKwh) => heatKwh / scop);
  const cost = electricityKwh.map((energyKwh) => energyKwh * price);
  const capacityStatus = heatingCapacityKw < peakHeatKw[0]
    ? 'insufficient'
    : heatingCapacityKw < peakHeatKw[1]
      ? 'borderline'
      : 'adequate';

  return {
    peakHeatKw,
    seasonalHeatDemand,
    electricityKwh,
    cost,
    capacityStatus,
    requiresIndividualSelection: capacityStatus !== 'adequate'
  };
}

/** @param {number} value */
export const formatEnergyNumber = (value) => Math.round(value).toLocaleString('pl-PL');
