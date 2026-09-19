export type CostRange = { low: number; high: number };
export type DevicePriority = 'price' | 'comfort' | 'heating' | 'unsure';

export const COST_CALCULATOR_CONFIG = {
  roomArea: { min: 10, max: 100, step: 1 },
  defaultInstallationMeters: 5,
  standardInstallationMeters: 5,
  maxInstallationMeters: 15,
  extraMeter: { low: 100, high: 150 },
  roundTo: 50,
  multiRoomUpperBufferPerAdditionalRoom: 500,
  powerBands: [
    { maxArea: 25, powerKw: '2,5', price: { low: 3499, high: 4500 } },
    { maxArea: 35, powerKw: '3,5', price: { low: 3499, high: 4500 } },
    { maxArea: 50, powerKw: '5,0', price: { low: 4500, high: 6000 } },
    { maxArea: 70, powerKw: '7,0', price: { low: 5500, high: 7500 } }
  ],
  priorities: {
    price: { label: 'Najlepsza cena', adjustment: { low: 0, high: 0 } },
    comfort: { label: 'Komfort i cisza', adjustment: { low: 400, high: 1200 } },
    heating: { label: 'Głównie do grzania', adjustment: { low: 700, high: 1800 } },
    unsure: { label: 'Nie wiem', adjustment: { low: 0, high: 600 } }
  }
} as const;

export type CostEstimateInput = {
  areas: number[];
  priority: DevicePriority;
  installationMeters: number;
};

export type RoomEstimate = {
  area: number;
  powerKw: string;
  price: CostRange;
};

export type CostEstimate = {
  kind: 'range';
  range: CostRange;
  rooms: RoomEstimate[];
  installationMeters: number;
} | {
  kind: 'individual';
  rooms: Array<{ area: number; powerKw: null }>;
  installationMeters: number;
};

const roundToStep = (value: number): number => {
  const step = COST_CALCULATOR_CONFIG.roundTo;
  return Math.round(value / step) * step;
};

export const getRoomEstimate = (area: number): RoomEstimate | null => {
  const band = COST_CALCULATOR_CONFIG.powerBands.find((item) => area <= item.maxArea);
  if (!band) return null;

  return {
    area,
    powerKw: band.powerKw,
    price: { low: band.price.low, high: band.price.high }
  };
};

export const calculateCostEstimate = ({
  areas,
  priority,
  installationMeters
}: CostEstimateInput): CostEstimate => {
  const rooms = areas.map((area) => getRoomEstimate(area));
  if (rooms.some((room) => room === null)) {
    return {
      kind: 'individual',
      rooms: areas.map((area) => ({ area, powerKw: null })),
      installationMeters
    };
  }

  const resolvedRooms = rooms as RoomEstimate[];
  const priorityAdjustment = COST_CALCULATOR_CONFIG.priorities[priority].adjustment;
  const extraMeters = Math.max(
    installationMeters - COST_CALCULATOR_CONFIG.standardInstallationMeters,
    0
  );

  const base = resolvedRooms.reduce(
    (sum, room) => ({
      low: sum.low + room.price.low,
      high: sum.high + room.price.high
    }),
    { low: 0, high: 0 }
  );

  const low =
    base.low +
    priorityAdjustment.low * resolvedRooms.length +
    extraMeters * COST_CALCULATOR_CONFIG.extraMeter.low;
  const high =
    base.high +
    priorityAdjustment.high * resolvedRooms.length +
    extraMeters * COST_CALCULATOR_CONFIG.extraMeter.high +
    Math.max(resolvedRooms.length - 1, 0) *
      COST_CALCULATOR_CONFIG.multiRoomUpperBufferPerAdditionalRoom;

  return {
    kind: 'range',
    range: { low: roundToStep(low), high: roundToStep(high) },
    rooms: resolvedRooms,
    installationMeters
  };
};
