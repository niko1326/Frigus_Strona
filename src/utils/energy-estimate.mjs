// Reference cooling season: Regulation (EU) 626/2011, Annex VII, Table 4.
// Nominal cooling capacity is used as an approximation of Pdesignc.
export const COOLING_REFERENCE_HOURS = 350;
export const USAGE_PROFILES = Object.freeze({
  occasional: { label: 'Sporadycznie', description: 'Kilka godzin w najcieplejsze dni', min: 0.6, max: 0.9 },
  standard: { label: 'Standardowo', description: 'Regularnie podczas upałów', min: 0.9, max: 1.3 },
  intensive: { label: 'Intensywnie', description: 'Wiele godzin dziennie przez większość sezonu', min: 1.3, max: 2 }
});

// Heating is an intentionally simplified building estimate, not an OZC calculation.
// The W/m² ranges are conservative design heuristics kept in one place and are not
// presented as a standard. Winter choices are user-friendly seasonal modifiers,
// inspired by (but not equivalent to) EU warmer/average/colder heating profiles.
export const HEATING_ASSUMPTIONS = Object.freeze({
  referenceHeightM: 2.6,
  equivalentFullLoadHours: { min: 900, max: 1300 },
  singleUnitReviewKw: 7,
  heatLoadWm2: {
    good: { label: 'Dobra izolacja', description: 'Nowszy lub dobrze ocieplony budynek', min: 35, max: 55 },
    standard: { label: 'Standardowa', description: 'Typowe ocieplone mieszkanie lub dom', min: 55, max: 80 },
    poor: { label: 'Słaba izolacja', description: 'Starszy budynek lub duże straty ciepła', min: 80, max: 120 }
  },
  heights: {
    low: { label: 'do 2,6 m', representativeM: 2.6 },
    standard: { label: '2,6–3,0 m', representativeM: 2.8 },
    high: { label: 'powyżej 3,0 m', representativeM: 3.2 }
  },
  winters: {
    mild: { label: 'Łagodniejsze warunki', description: 'Temperatury rzadko spadają mocno poniżej 0°C', factor: 0.8 },
    standard: { label: 'Typowa polska zima', description: 'Regularny mróz, ale bez długich okresów bardzo niskich temperatur', factor: 1 },
    cold: { label: 'Chłodne warunki', description: 'Częste lub dłuższe okresy silnego mrozu', factor: 1.25 }
  }
});

/**
 * Usage multipliers are illustrative assumptions, not an EU technical standard.
 * @param {{power: number, seer: number, price: number, usage: keyof typeof USAGE_PROFILES}} input
 */
export function calculateEnergyEstimate({ power, seer, price, usage }) {
  if (!Number.isFinite(price) || price < 0 || !Object.hasOwn(USAGE_PROFILES, usage)) {
    throw new RangeError('Podaj poprawną cenę energii i sposób użytkowania.');
  }
  if (!Number.isFinite(power) || power <= 0 || !Number.isFinite(seer) || seer <= 0) {
    throw new RangeError('Moc i SEER muszą być dodatnimi liczbami.');
  }
  const referenceKwh = power * COOLING_REFERENCE_HOURS / seer;
  const profile = USAGE_PROFILES[usage];
  return {
    referenceKwh,
    seasonCost: referenceKwh * price,
    usageKwh: [referenceKwh * profile.min, referenceKwh * profile.max],
    usageCost: [referenceKwh * profile.min * price, referenceKwh * profile.max * price]
  };
}

/**
 * Simplified heating estimate: building heat-load range × height correction ×
 * seasonal winter modifier × equivalent full-load-hour range, divided by SCOP.
 * It does not replace OZC or appliance sizing at design temperature.
 * @param {{area: number, height: keyof typeof HEATING_ASSUMPTIONS.heights, insulation: keyof typeof HEATING_ASSUMPTIONS.heatLoadWm2, winter: keyof typeof HEATING_ASSUMPTIONS.winters, scop: number, price: number}} input
 */
export function calculateHeatingEstimate({ area, height, insulation, winter, scop, price }) {
  const heightProfile = HEATING_ASSUMPTIONS.heights[height];
  const insulationProfile = HEATING_ASSUMPTIONS.heatLoadWm2[insulation];
  const winterProfile = HEATING_ASSUMPTIONS.winters[winter];
  if (!Number.isFinite(area) || area <= 0 || !Number.isFinite(scop) || scop <= 0 ||
      !Number.isFinite(price) || price < 0 || !heightProfile || !insulationProfile || !winterProfile) {
    throw new RangeError('Podaj poprawne dane ogrzewanej strefy, SCOP i cenę energii.');
  }

  const heightFactor = heightProfile.representativeM / HEATING_ASSUMPTIONS.referenceHeightM;
  const peakHeatKw = [insulationProfile.min, insulationProfile.max].map((loadWm2) =>
    area * heightFactor * loadWm2 * winterProfile.factor / 1000
  );
  const seasonalHeatDemand = [
    peakHeatKw[0] * HEATING_ASSUMPTIONS.equivalentFullLoadHours.min,
    peakHeatKw[1] * HEATING_ASSUMPTIONS.equivalentFullLoadHours.max
  ];
  const electricityKwh = seasonalHeatDemand.map((heatKwh) => heatKwh / scop);
  const cost = electricityKwh.map((energyKwh) => energyKwh * price);

  return {
    heightFactor,
    peakHeatKw,
    seasonalHeatDemand,
    electricityKwh,
    cost,
    requiresIndividualSelection: peakHeatKw[1] > HEATING_ASSUMPTIONS.singleUnitReviewKw
  };
}

/** @param {number} value */
export const formatEnergyNumber = (value) => Math.round(value).toLocaleString('pl-PL');
