export type CostRange = { low: number; high: number };
export type DevicePriority = 'price' | 'comfort' | 'heating' | 'unsure';

export type CostCalculatorConfig = {
  roomArea: { min: number; max: number; step: number };
  defaultInstallationMeters: number;
  standardInstallationMeters: number;
  maxInstallationMeters: number;
  extraMeter: CostRange;
  roundTo: number;
  multiRoomUpperBufferPerAdditionalRoom: number;
  powerBands: readonly { maxArea: number; powerKw: string; price: CostRange }[];
  priorities: Record<DevicePriority, { label: string; adjustment: CostRange }>;
};

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

/** The same estimator runs server-side and in the browser with a projected config.
 * This module imports no product catalog; prices are supplied by central config.
 */
export function createCostCalculator(config: CostCalculatorConfig) {
  const roundToStep = (value: number): number => {
    const step = config.roundTo;
    return Math.round(value / step) * step;
  };

  const getRoomEstimate = (area: number): RoomEstimate | null => {
    const band = config.powerBands.find((item) => area <= item.maxArea);
    if (!band) return null;

    return {
      area,
      powerKw: band.powerKw,
      price: { low: band.price.low, high: band.price.high }
    };
  };

  const calculateCostEstimate = ({
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
    const priorityAdjustment = config.priorities[priority].adjustment;
    const extraMeters = Math.max(
      installationMeters - config.standardInstallationMeters,
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
      extraMeters * config.extraMeter.low;
    const high =
      base.high +
      priorityAdjustment.high * resolvedRooms.length +
      extraMeters * config.extraMeter.high +
      Math.max(resolvedRooms.length - 1, 0) *
        config.multiRoomUpperBufferPerAdditionalRoom;

    return {
      kind: 'range',
      range: { low: roundToStep(low), high: roundToStep(high) },
      rooms: resolvedRooms,
      installationMeters
    };
  };

  return { getRoomEstimate, calculateCostEstimate };
}
