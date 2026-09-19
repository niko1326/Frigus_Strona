export type PowerCalculatorInput = {
  area: number;
  height: keyof typeof POWER_CALCULATOR_CONFIG.height;
  sun: keyof typeof POWER_CALCULATOR_CONFIG.sun;
  location: keyof typeof POWER_CALCULATOR_CONFIG.location;
  glazing: keyof typeof POWER_CALCULATOR_CONFIG.glazing;
};

export const POWER_CALCULATOR_CONFIG = {
  area: {
    min: 10,
    max: 100,
    default: 35,
    individualAbove: 70
  },
  baseKwPerSquareMeter: 0.1,
  height: {
    standard: { label: 'do 2,7 m', correction: 0 },
    elevated: { label: '2,7–3,2 m', correction: 0.08 },
    high: { label: 'powyżej 3,2 m', correction: 0.15 }
  },
  sun: {
    low: { label: 'Niewielkie', correction: -0.05 },
    standard: { label: 'Standardowe', correction: 0 },
    high: { label: 'Duże', correction: 0.1 }
  },
  location: {
    middle: { label: 'Środkowe piętro', correction: 0 },
    top: { label: 'Ostatnie piętro / poddasze', correction: 0.1 }
  },
  glazing: {
    no: { label: 'Nie', correction: 0 },
    yes: { label: 'Tak', correction: 0.08 }
  },
  typicalPowers: [
    { maxNeedKw: 2.5, powerKw: '2,5', btu: '9 000' },
    { maxNeedKw: 3.5, powerKw: '3,5', btu: '12 000' },
    { maxNeedKw: 5, powerKw: '5,0', btu: '18 000' },
    { maxNeedKw: 7, powerKw: '7,0', btu: '24 000' }
  ]
} as const;

export type PowerEstimate =
  | {
      kind: 'typical';
      needKw: number;
      powerKw: string;
      btu: string;
      correction: number;
    }
  | {
      kind: 'individual';
      needKw: number;
      correction: number;
      reason: 'area' | 'load';
    };

export const calculatePowerEstimate = (input: PowerCalculatorInput): PowerEstimate => {
  const area = Math.min(
    Math.max(input.area, POWER_CALCULATOR_CONFIG.area.min),
    POWER_CALCULATOR_CONFIG.area.max
  );
  const correction =
    POWER_CALCULATOR_CONFIG.height[input.height].correction +
    POWER_CALCULATOR_CONFIG.sun[input.sun].correction +
    POWER_CALCULATOR_CONFIG.location[input.location].correction +
    POWER_CALCULATOR_CONFIG.glazing[input.glazing].correction;
  const needKw = Math.round(
    area * POWER_CALCULATOR_CONFIG.baseKwPerSquareMeter * (1 + correction) * 10
  ) / 10;

  if (area > POWER_CALCULATOR_CONFIG.area.individualAbove) {
    return { kind: 'individual', needKw, correction, reason: 'area' };
  }

  const typicalPower = POWER_CALCULATOR_CONFIG.typicalPowers.find(
    (item) => needKw <= item.maxNeedKw
  );
  if (!typicalPower) {
    return { kind: 'individual', needKw, correction, reason: 'load' };
  }

  return {
    kind: 'typical',
    needKw,
    powerKw: typicalPower.powerKw,
    btu: typicalPower.btu,
    correction
  };
};
