export function buildEnergyCalculatorHref(basePath, modelSlug, powerKw) {
  const normalizedPath = `${basePath.replace(/\/$/, '')}/`;
  const params = new URLSearchParams({ model: modelSlug });
  if (Number.isFinite(powerKw)) params.set('power', String(powerKw));
  return `${normalizedPath}?${params.toString()}`;
}

export function buildEnergyCalculatorLabel(brand, modelName, variantLabel) {
  const identity = `${brand} ${modelName}`;
  return variantLabel
    ? `Sprawdź zużycie energii dla ${identity} ${variantLabel} kW`
    : `Sprawdź zużycie energii dla ${identity}`;
}
