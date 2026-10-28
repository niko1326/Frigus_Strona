import manifest from '../config/responsive-images.json';

type ImageEntry = {
  width: number;
  height: number;
  variants: { src: string; width: number }[];
};

const images: Record<string, ImageEntry> = manifest;

/** Dimensions retain the source aspect ratio; srcset lets the browser select a preview. */
export const getResponsiveImage = (source: string, preferredWidth = 720) => {
  const image = images[source];
  if (!image) throw new Error(`Missing responsive image metadata: ${source}. Run scripts/generate-responsive-images.mjs.`);
  const candidates = image.variants;
  const fallback = candidates.find((variant) => variant.width >= preferredWidth) ?? candidates.at(-1);
  return {
    src: fallback?.src ?? source,
    srcset: candidates.length > 1
      ? candidates.map((variant) => `${variant.src} ${variant.width}w`).join(', ')
      : undefined,
    width: image.width,
    height: image.height
  };
};
