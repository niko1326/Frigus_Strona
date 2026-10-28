/** Parametry dodatkowe. null oznacza brak potwierdzenia, nigdy „nie”.
 * Moce, SEER, SCOP, ceny, zdjęcia i istniejące kolory pozostają w lineups.ts.
 * Parametry liczbowe zależne od mocy zapisujemy wyłącznie przy wariancie.
 */
export type TechnicalData = {
  modelCode: string | null;
  coolingEnergyClass: string | null;
  heatingEnergyClass: string | null;
  heatingClimate: string | null;
  ratedInput: { coolingKw: number | null; heatingKw: number | null };
  modulation: { coolingMinKw: number | null; coolingMaxKw: number | null; heatingMinKw: number | null; heatingMaxKw: number | null };
  indoorNoise: { minDb: number | null; maxDb: number | null; levelsDb: number[] | null; context: string | null; soundPowerDb: number | null };
  outdoorNoise: { soundPressureDb: number | null; soundPowerDb: number | null; context: string | null; soundPowerContext: string | null; silentMode: boolean | null };
  operatingRange: { coolingMinC: number | null; coolingMaxC: number | null; heatingMinC: number | null; heatingMaxC: number | null };
  heatingFeatures: {
    trayHeater: boolean | null;
    crankcaseHeater: boolean | null;
    compressorWindingHeating: boolean | null;
    lowTempPerformance: Array<{ outdoorTempC: number; capacityKw: number | null; retainedPercent: number | null; context: string }> | null;
  };
  airflow: { directions: string | null; fanSpeeds: number | null; fanSpeedControl: string | null; gentleCooling: string | null; silentMode: boolean | null; nightMode: boolean | null; automaticLouvers: string | null; indirectAirflow: string | null };
  airQuality: { ionizer: boolean | null; uvc: boolean | null; filters: string[] | null; selfClean: boolean | null; autoDry: boolean | null; sterilization: string | null; sterilizationTempC: number | null; dehumidification: boolean | null; dehumidificationLh: number | null; humidityControl: boolean | null };
  controls: { wifi: boolean | null; app: string | null; voiceControl: string | null; modbus: string | null; bms: string | null; remote: string | null; additionalControllers: string[] | null; onOffPort: boolean | null };
  design: { colors: string[] | null; finish: string | null; dimensions: { widthMm: number; heightMm: number; depthMm: number } | null };
};

export type PartialTechnicalData = {
  [K in keyof TechnicalData]?: TechnicalData[K] extends object | null
    ? Partial<NonNullable<TechnicalData[K]>> | null
    : TechnicalData[K];
};

export type TechnicalEvidence = { sourceId: string; locator: string };
export type TechnicalSources = Record<string, TechnicalEvidence>;

/** Ścieżki stanowią także kontrakt audytu i przyszłych szablonów oferty. */
export const TECHNICAL_FIELDS = [
  ['modelCode', 'Kod zestawu', ''],
  ['coolingCapacityKw', 'Nominalna moc chłodnicza', 'kW'],
  ['heatingCapacityKw', 'Nominalna moc grzewcza', 'kW'],
  ['seer', 'SEER', ''], ['scop', 'SCOP', ''],
  ['coolingEnergyClass', 'Klasa chłodzenia', ''], ['heatingEnergyClass', 'Klasa grzania', ''],
  ['heatingClimate', 'Klimat dla SCOP / klasy grzania', ''],
  ['ratedInput.coolingKw', 'Nominalny pobór — chłodzenie', 'kW'], ['ratedInput.heatingKw', 'Nominalny pobór — grzanie', 'kW'],
  ['modulation.coolingMinKw', 'Minimalna moc chłodzenia', 'kW'], ['modulation.coolingMaxKw', 'Maksymalna moc chłodzenia', 'kW'],
  ['modulation.heatingMinKw', 'Minimalna moc grzania', 'kW'], ['modulation.heatingMaxKw', 'Maksymalna moc grzania', 'kW'],
  ['indoorNoise.minDb', 'Minimalne ciśnienie akustyczne wewnątrz', 'dB(A)'], ['indoorNoise.maxDb', 'Maksymalne ciśnienie akustyczne wewnątrz', 'dB(A)'],
  ['indoorNoise.levelsDb', 'Ciśnienie akustyczne — biegi', 'dB(A)'], ['indoorNoise.context', 'Warunki pomiaru hałasu wewnątrz', ''],
  ['indoorNoise.soundPowerDb', 'Moc akustyczna wewnątrz', 'dB(A)'],
  ['outdoorNoise.soundPressureDb', 'Ciśnienie akustyczne na zewnątrz', 'dB(A)'], ['outdoorNoise.soundPowerDb', 'Moc akustyczna na zewnątrz', 'dB(A)'], ['outdoorNoise.context', 'Warunki pomiaru hałasu na zewnątrz', ''],
  ['operatingRange.coolingMinC', 'Minimalna temperatura chłodzenia', '°C'], ['operatingRange.coolingMaxC', 'Maksymalna temperatura chłodzenia', '°C'],
  ['operatingRange.heatingMinC', 'Minimalna temperatura grzania', '°C'], ['operatingRange.heatingMaxC', 'Maksymalna temperatura grzania', '°C'],
  ['heatingFeatures.trayHeater', 'Grzałka tacy skroplin', ''], ['heatingFeatures.crankcaseHeater', 'Grzałka karteru', ''], ['heatingFeatures.compressorWindingHeating', 'Podgrzewanie uzwojeń sprężarki', ''], ['heatingFeatures.lowTempPerformance', 'Wydajność w niskich temperaturach', ''],
  ['airflow.directions', 'Kierunki nawiewu', ''], ['airflow.fanSpeeds', 'Liczba prędkości wentylatora', ''], ['airflow.gentleCooling', 'Łagodny nawiew', ''], ['airflow.silentMode', 'Tryb cichy', ''], ['airflow.nightMode', 'Tryb nocny', ''], ['airflow.automaticLouvers', 'Automatyczne żaluzje', ''], ['airflow.indirectAirflow', 'Nawiew pośredni', ''],
  ['airQuality.ionizer', 'Jonizator', ''], ['airQuality.uvc', 'Lampa UVC', ''], ['airQuality.filters', 'Filtry', ''], ['airQuality.selfClean', 'Samooczyszczanie', ''], ['airQuality.sterilization', 'Sterylizacja', ''], ['airQuality.sterilizationTempC', 'Temperatura sterylizacji', '°C'], ['airQuality.dehumidification', 'Osuszanie', ''], ['airQuality.humidityControl', 'Kontrola wilgotności', ''],
  ['controls.wifi', 'Wi-Fi', ''], ['controls.app', 'Aplikacja', ''], ['controls.voiceControl', 'Sterowanie głosowe', ''], ['controls.modbus', 'Modbus', ''], ['controls.bms', 'BMS', ''], ['controls.remote', 'Pilot', ''], ['controls.additionalControllers', 'Dodatkowe sterowniki', ''],
  ['design.colors', 'Kolory', ''], ['design.finish', 'Wykończenie', ''], ['design.dimensions', 'Wymiary jednostki wewnętrznej', 'mm'],
  ['productImages', 'Zdjęcia', ''], ['priceFromPLN', 'Cena wybranego wariantu z montażem', 'zł'], ['colorAffectsPrice', 'Kolor wpływa na cenę', ''],
  ['airflow.fanSpeedControl', 'Regulacja prędkości wentylatora', ''], ['airQuality.dehumidificationLh', 'Wydajność osuszania', 'l/h'], ['controls.onOffPort', 'Port ON/OFF', ''],
  ['airQuality.autoDry', 'Osuszanie wymiennika', ''], ['outdoorNoise.soundPowerContext', 'Warunki pomiaru mocy akustycznej na zewnątrz', ''], ['outdoorNoise.silentMode', 'Tryb cichy jednostki zewnętrznej', '']
] as const;

export type TechnicalFieldPath = typeof TECHNICAL_FIELDS[number][0];

export function readPath(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) =>
    node !== null && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined, value) ?? null;
}

export function writePath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.');
  let cursor = target;
  for (const key of keys.slice(0, -1)) {
    cursor[key] ??= {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys.at(-1)!] = value;
}
