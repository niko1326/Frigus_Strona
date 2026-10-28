import type { EnergyVariant, LineupModel, ProductColor } from '../config/lineups.ts';
import { TECHNICAL_FIELDS, readPath, writePath, type TechnicalData, type TechnicalSources } from '../config/product-technical.ts';

export type ResolvedTechnicalData = TechnicalData & {
  coolingCapacityKw: number | null;
  heatingCapacityKw: number | null;
  seer: number | null;
  scop: number | null;
  productImages: string[] | null;
  priceFromPLN: number | null;
  colorAffectsPrice: boolean | null;
};

export type ResolvedProductColor = {
  name: string;
  image: string | null;
  alt: string | null;
  priceTier?: 'color';
};

/** Existing color/image associations remain authoritative. An unassigned image stays null. */
export function getProductColors(model: LineupModel): ResolvedProductColor[] {
  if (model.product?.colors?.length) return model.product.colors.map((color) => ({ ...color }));
  return (model.technicalData?.design?.colors ?? []).map((name) => ({ name, image: null, alt: null }));
}

/** A view over the one central catalog; this function stores no independent product facts. */
export function resolveTechnicalData(
  model: LineupModel,
  variant: EnergyVariant,
  color?: ProductColor | ResolvedProductColor | string
): ResolvedTechnicalData {
  const result: Record<string, unknown> = {};
  for (const [path] of TECHNICAL_FIELDS) {
    const variantValue = readPath(variant.technicalData, path);
    const modelValue = readPath(model.technicalData, path);
    writePath(result, path, variantValue ?? modelValue ?? null);
  }

  // Never parse series summaries (noise/classes) into per-power technical values.
  for (const path of ['coolingCapacityKw', 'heatingCapacityKw', 'seer', 'scop'] as const) {
    result[path] = variant[path] ?? null;
  }

  // Reuse the exact app name already confirmed in the legacy configuration.
  // A generic "aplikacja mobilna" label does not identify an app.
  if (readPath(result, 'controls.app') === null &&
      model.connectivityLabel === 'Sterowanie Wi-Fi / aplikacja Gree+') {
    writePath(result, 'controls.app', 'Gree+');
  }

  const colors = getProductColors(model);
  const selectedName = typeof color === 'string' ? color : color?.name;
  const selectedColor = selectedName ? colors.find((item) => item.name === selectedName) : undefined;
  if (selectedName && !selectedColor) throw new RangeError(`Nieznany kolor modelu ${model.slug}: ${selectedName}`);
  const existingColors = model.product?.colors;
  if (existingColors?.length) writePath(result, 'design.colors', existingColors.map((item) => item.name));

  const basePrice = variant.priceFromPLN ?? variant.installedPriceFromPLN ?? null;
  // A price from a different power or a series starting price is never a substitute.
  result.priceFromPLN = selectedColor?.priceTier === 'color'
    ? variant.colorPriceFromPLN ?? null
    : basePrice;
  result.colorAffectsPrice = basePrice !== null && variant.colorPriceFromPLN !== undefined
    ? variant.colorPriceFromPLN !== basePrice
    : null;

  result.productImages = selectedColor
    ? selectedColor.image ? [selectedColor.image] : null
    : [...new Set([model.image, ...colors.flatMap((item) => item.image ? [item.image] : [])])].filter(Boolean);
  return result as ResolvedTechnicalData;
}

export function resolveTechnicalSources(model: LineupModel, variant: EnergyVariant): TechnicalSources {
  return { ...model.technicalDataSources, ...variant.technicalDataSources };
}
