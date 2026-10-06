const stripDiacritics = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ł/gi, (letter) => (letter === 'Ł' ? 'L' : 'l'));

/** Stabilna wartość parametru `moc`, np. 3,6 -> 3.6. */
export const toPowerParam = (value) => {
  const normalized = String(value).trim().replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return '';
  if (!normalized.includes('.')) return String(parsed);

  const fraction = normalized.split('.')[1]?.replace(/0+$/, '') ?? '';
  return `${Math.trunc(parsed)}.${fraction || '0'}`;
};

/** Stabilna wartość parametru `kolor`, bez polskich znaków. */
export const toColorParam = (value) => stripDiacritics(value)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

/**
 * Odczytuje wyłącznie istniejące warianty. Nieprawidłowe wartości pozostawiają
 * domyślną moc lub kolor i nigdy nie tworzą nowej konfiguracji produktu.
 * @param {{ search?: string | URLSearchParams, powers: Array<string | number>, colors?: string[] }} options
 */
export const resolveVariantSelection = ({ search = '', powers, colors = [] }) => {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const normalizedPowers = powers.map(toPowerParam);
  const normalizedColors = colors.map(toColorParam);
  const requestedPower = toPowerParam(params.get('moc') ?? '');
  const requestedColor = toColorParam(params.get('kolor') ?? '');
  const selectedPower = normalizedPowers.find((power) => Number(power) === Number(requestedPower));

  return {
    power: selectedPower ?? normalizedPowers[0],
    color: normalizedColors.length > 1 && normalizedColors.includes(requestedColor)
      ? requestedColor
      : normalizedColors[0] ?? null,
    hasPowerParam: params.has('moc'),
    hasColorParam: params.has('kolor')
  };
};

/**
 * Buduje adres konkretnej konfiguracji, zachowując inne parametry i hash.
 * @param {string | URL} currentUrl
 * @param {{ power: string | number, color?: string, hasColorVariants?: boolean }} selection
 */
export const buildVariantUrl = (currentUrl, { power, color, hasColorVariants = false }) => {
  const url = new URL(currentUrl);
  const powerParam = toPowerParam(power);
  if (powerParam) url.searchParams.set('moc', powerParam);
  else url.searchParams.delete('moc');

  const colorParam = toColorParam(color ?? '');
  if (hasColorVariants && colorParam) url.searchParams.set('kolor', colorParam);
  else url.searchParams.delete('kolor');

  return url.toString();
};

/**
 * Wewnętrzne SKU FrigAC; nie jest oznaczane jako GTIN, EAN ani MPN.
 * @param {{ brand: string, series: string, power: string | number, color?: string }} variant
 */
export const buildVariantSku = ({ brand, series, power, color }) => [
  'FRIGAC',
  stripDiacritics(brand).replace(/[^a-z0-9]/gi, '').toUpperCase(),
  stripDiacritics(series).replace(/[^a-z0-9]/gi, '').toUpperCase(),
  toPowerParam(power).replace('.', ''),
  ...(color ? [stripDiacritics(color).replace(/[^a-z0-9]/gi, '').toUpperCase()] : [])
].filter(Boolean).join('-');
