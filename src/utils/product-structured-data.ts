import type { EnergyVariant, ProductColor, ProductLineupModel } from '../config/lineups';
import { buildVariantSku, buildVariantUrl } from './product-variant-url.mjs';

type BuildProductStructuredDataOptions = {
  brand: string;
  category: string;
  model: ProductLineupModel;
  pageUrl: string;
};

const formatPower = (value: number): string => new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
  maximumFractionDigits: 2
}).format(value);

const toIdentifier = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/ł/g, 'l')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const getVariantPrice = (variant: EnergyVariant, color?: ProductColor): number | undefined =>
  color?.priceTier === 'color' ? variant.colorPriceFromPLN : variant.priceFromPLN;

const buildVariant = ({
  brand,
  category,
  color,
  groupId,
  model,
  pageUrl,
  variant
}: BuildProductStructuredDataOptions & {
  color?: ProductColor;
  groupId?: string;
  variant: EnergyVariant;
}) => {
  const price = getVariantPrice(variant, color);
  if (typeof price !== 'number') return null;

  const seriesName = model.product.ctaName ?? model.name;
  const colorSuffix = color ? ` ${color.name}` : '';
  const hasColorVariants = (model.product.colors?.length ?? 0) > 1;
  const variantUrl = buildVariantUrl(pageUrl, {
    power: variant.label,
    color: color?.name,
    hasColorVariants
  });
  const variantId = [model.product.slug, variant.label, color?.name]
    .filter(Boolean)
    .map((part) => toIdentifier(String(part)))
    .join('-');

  return {
    '@type': 'Product',
    '@id': `${pageUrl}#wariant-${variantId}`,
    name: `${brand} ${seriesName} ${variant.label} kW${colorSuffix}`,
    sku: buildVariantSku({
      brand,
      series: model.product.slug,
      power: variant.label,
      color: hasColorVariants ? color?.name : undefined
    }),
    description: model.product.description,
    image: new URL(color?.image ?? model.image, pageUrl).toString(),
    url: variantUrl,
    brand: { '@type': 'Brand', name: brand },
    category,
    ...(color ? { color: color.name } : {}),
    ...(groupId ? { isVariantOf: { '@id': groupId } } : {}),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Moc chłodnicza',
        value: `${formatPower(variant.coolingCapacityKw)} kW`
      },
      {
        '@type': 'PropertyValue',
        name: 'Moc grzewcza',
        value: `${formatPower(variant.heatingCapacityKw)} kW`
      }
    ],
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'PLN',
      url: variantUrl,
      description: 'Cena brutto obejmuje urządzenie i standardowy montaż do 3 mb.'
    }
  };
};

/**
 * Buduje ProductGroup i jego wycenione warianty na podstawie centralnej konfiguracji.
 * Warianty bez potwierdzonej ceny nie trafiają do Product, aby nie publikować fikcyjnych Offer.
 */
export const buildProductStructuredData = ({
  brand,
  category,
  model,
  pageUrl
}: BuildProductStructuredDataOptions): Record<string, unknown> => {
  const colors = model.product.colors ?? [];
  const groupId = `${pageUrl}#grupa-produktowa`;
  const variants = model.variants.flatMap((variant) => {
    const colorVariants = colors.length > 0 ? colors : [undefined];
    return colorVariants
      .map((color) => buildVariant({ brand, category, color, groupId, model, pageUrl, variant }))
      .filter((item): item is NonNullable<typeof item> => item !== null);
  });

  if (model.variants.length === 1 && colors.length <= 1 && variants.length === 1) {
    const [singleProduct] = variants;
    const { isVariantOf: _isVariantOf, ...product } = singleProduct;
    return { '@context': 'https://schema.org', ...product };
  }

  const images = colors.length > 0
    ? colors.map((color) => new URL(color.image, pageUrl).toString())
    : [new URL(model.image, pageUrl).toString()];

  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    '@id': groupId,
    productGroupID: `${brand.toLowerCase()}-${model.product.slug}`,
    name: `${brand} ${model.name}`,
    description: model.product.description,
    image: images,
    url: pageUrl,
    brand: { '@type': 'Brand', name: brand },
    category,
    ...(colors.length > 1 ? { variesBy: ['https://schema.org/color'] } : {}),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Dostępne warianty mocy',
        value: model.variants.map((variant) => `${variant.label} kW`).join(', ')
      },
      ...(model.energyClass
        ? [{ '@type': 'PropertyValue', name: 'Klasa energetyczna', value: model.energyClass }]
        : []),
      ...(model.noise
        ? [{ '@type': 'PropertyValue', name: 'Poziom ciśnienia akustycznego', value: model.noise }]
        : []),
      ...(model.connectivityLabel
        ? [{ '@type': 'PropertyValue', name: 'Sterowanie', value: model.connectivityLabel }]
        : [])
    ],
    hasVariant: variants
  };
};
