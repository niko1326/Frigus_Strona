import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { GREE_MODELS, KAISAI_MODELS, KAISAI_UNAVAILABLE_MODELS } from '../src/config/lineups.ts';
import { TECHNICAL_FIELDS, readPath } from '../src/config/product-technical.ts';
import { resolveTechnicalData, resolveTechnicalSources, getProductColors } from '../src/utils/product-technical.ts';

const directory = new URL('../docs/product-research/', import.meta.url);
const baseline = JSON.parse(await readFile(new URL('catalog-before.json', directory), 'utf8'));
const registryDocument = JSON.parse(await readFile(new URL('../src/config/product-sources.json', import.meta.url), 'utf8'));
const registry = registryDocument.sources ?? registryDocument;
const research = await Promise.all(['gree-research.json', 'kaisai-research.json'].map(async (file) =>
  JSON.parse(await readFile(new URL(file, directory), 'utf8'))));
const models = [...GREE_MODELS, ...KAISAI_MODELS, ...KAISAI_UNAVAILABLE_MODELS];
const observations = research.flatMap((document) => document.observations ?? []);
const explicitConflicts = research.flatMap((document) => document.conflicts ?? []);
const findings = research.flatMap((document) => document.findings ?? []);
const conflictingSourceFindings = findings.filter((item) => item.status === 'CONFLICT')
  .map((item) => ({ ...item, conflictKind: 'source' }));
const existingSource = 'src/config/lineups.ts — zastana wartość używana na stronie; snapshot catalog-before.json';
const asOf = '2026-10-29';
const rows = [];
const conflicts = new Map();
const sourceConflicts = new Map();
const added = new Map();
const completeness = [];
const unavailableImages = [];
const unpricedCombinations = [];
const fieldLabels = new Map(TECHNICAL_FIELDS.map(([path, label]) => [path, label]));

const serialized = (value) => value === undefined || value === null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
// Source contradictions can contain several candidates and deliberately leave the
// technical value null. Keep those candidates visible instead of calling them
// ordinary missing data or choosing one of them here.
const comparisonValue = (comparison) => comparison?.newValue ?? comparison?.sourceValue ?? comparison?.value ?? comparison?.values;
const matches = (item, model, variant, path) =>
  item.modelSlug === model.slug && (item.powerKw === null || item.powerKw === undefined || Number(item.powerKw) === variant.powerKw) && item.path === path;
const sourceText = (evidence) => {
  if (!evidence) return '';
  const source = registry[evidence.sourceId];
  return [evidence.sourceId, source?.url, evidence.locator].filter(Boolean).join(' | ');
};

function addRow(model, variant, colorName, path, before, current, source, comparison) {
  const candidate = comparisonValue(comparison);
  const isSourceConflict = comparison?.conflictKind === 'source';
  const isConflict = isSourceConflict || (comparison !== undefined && candidate !== undefined && !equal(candidate, before ?? current));
  const status = isConflict ? 'CONFLICT' : current === null || current === undefined ? 'MISSING' : 'VERIFIED';
  rows.push({
    MARKA: model.slug.startsWith('gree-') ? 'GREE' : 'KAISAI',
    MODEL: model.name, MOC: variant.label, KOLOR: colorName,
    PARAMETR: path, OBECNA_WARTOSC: before ?? current ?? null, STATUS: status,
    ZRODLO: source, NOWA_WARTOSC: isConflict ? candidate : null
  });
  if (isConflict) {
    const key = `${model.slug}|${variant.powerKw}|${path}|${serialized(candidate)}`;
    const collection = isSourceConflict ? sourceConflicts : conflicts;
    collection.set(key, { model: model.name, modelSlug: model.slug, powerKw: variant.powerKw, path, currentValue: before ?? current ?? null, newValue: candidate ?? null, source, note: comparison.note ?? comparison.reason ?? null });
  }
}

// Keep every legacy public property auditable, including series summaries.
function flattenLegacy(value, prefix = '') {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value) || typeof value !== 'object') return [[prefix, value]];
  return Object.entries(value).flatMap(([key, child]) =>
    ['technicalData', 'technicalDataSources', 'technicalDataConflicts', 'variants', 'colors'].includes(key)
      ? [] : flattenLegacy(child, prefix ? `${prefix}.${key}` : key));
}

for (const model of models) {
  const beforeModel = baseline.find((item) => item.slug === model.slug);
  if (!beforeModel) throw new Error(`Model bez pierwotnego audytu: ${model.slug}`);
  const missing = new Map();
  let presentCount = 0;
  let requiredCount = 0;
  for (const variant of model.variants) {
    const beforeVariant = beforeModel.variants.find((item) => item.powerKw === variant.powerKw);
    if (!beforeVariant) throw new Error(`Wariant bez pierwotnego audytu: ${model.slug} ${variant.powerKw}`);
    const resolved = resolveTechnicalData(model, variant);
    const beforeResolved = resolveTechnicalData(beforeModel, beforeVariant);
    const evidence = resolveTechnicalSources(model, variant);
    for (const [path] of TECHNICAL_FIELDS) {
      const currentValue = readPath(resolved, path);
      requiredCount++;
      if (currentValue !== null) presentCount++;
      else missing.set(path, (missing.get(path) ?? 0) + 1);
    }
    const colors = getProductColors(model);
    const selections = colors.length ? colors : [undefined];
    for (const color of selections) {
      const current = resolveTechnicalData(model, variant, color);
      // Newly researched color names need not exist in the baseline selection list.
      const baselineColor = beforeModel.product?.colors?.find((item) => item.name === color?.name);
      const before = baselineColor ? resolveTechnicalData(beforeModel, beforeVariant, baselineColor) : beforeResolved;
      const colorName = color?.name ?? 'Nieokreślony w zastanej konfiguracji';
      for (const [path] of TECHNICAL_FIELDS) {
        const currentValue = readPath(current, path);
        const beforeValue = readPath(before, path);
        const comparison = explicitConflicts.find((item) => matches(item, model, variant, path))
          ?? observations.find((item) => matches(item, model, variant, path) && beforeValue !== null && !equal(item.value, beforeValue))
          ?? conflictingSourceFindings.find((item) => matches(item, model, variant, path));
        const source = comparison ? sourceText(comparison)
          : beforeValue !== null ? existingSource : sourceText(evidence[path] ?? findings.find((item) => matches(item, model, variant, path)));
        addRow(model, variant, colorName, path, beforeValue, currentValue, source, comparison);
      }
      for (const [path, value] of flattenLegacy(beforeModel)) {
        const comparison = explicitConflicts.find((item) => matches(item, model, variant, path));
        addRow(model, variant, colorName, `legacy.${path}`, value, value, comparison ? sourceText(comparison) : existingSource, comparison);
      }
      for (const [path, value] of flattenLegacy(beforeVariant)) {
        if (!fieldLabels.has(path)) addRow(model, variant, colorName, `legacy.variant.${path}`, value, value, existingSource);
      }
      if (baselineColor) for (const [path, value] of flattenLegacy(baselineColor)) {
        addRow(model, variant, colorName, `legacy.product.colors.${path}`, value, value, existingSource);
      }
      if (current.priceFromPLN === null) unpricedCombinations.push({ model: model.name, powerKw: variant.powerKw, color: colorName });
      if (current.productImages === null || current.productImages.length === 0) unavailableImages.push({ model: model.name, powerKw: variant.powerKw, color: colorName, reason: 'Brak przypisanego zdjęcia koloru' });
    }
    // Count stored facts once, regardless of the number of color rows in the CSV.
    for (const [path] of TECHNICAL_FIELDS) {
      const value = readPath(variant.technicalData, path);
      if (value !== null) added.set(`${model.slug}|${variant.powerKw}|${path}`, { modelSlug: model.slug, powerKw: variant.powerKw, path, value });
    }
  }
  for (const [path] of TECHNICAL_FIELDS) {
    const value = readPath(model.technicalData, path);
    if (value !== null) added.set(`${model.slug}|shared|${path}`, { modelSlug: model.slug, powerKw: null, path, value });
  }
  completeness.push({ model: model.name, modelSlug: model.slug, variants: model.variants.length, present: presentCount, total: requiredCount,
    percentage: Math.round(presentCount / requiredCount * 100), missing: Object.fromEntries(missing), unavailable: model.unavailable === true });
}

// Legacy files may be missing even where a mapping exists; never hide this behind a URL string.
const imagePaths = new Map();
for (const model of models) for (const path of [model.image, ...getProductColors(model).flatMap((color) => color.image ? [color.image] : [])]) {
  if (!path?.startsWith('/')) continue;
  imagePaths.set(path, model.name);
}
for (const [path, model] of imagePaths) {
  try { await access(new URL(`../public${path}`, import.meta.url)); }
  catch { unavailableImages.push({ model, path, reason: 'Plik nie istnieje w public/' }); }
}

const statusCounts = Object.fromEntries(['VERIFIED', 'MISSING', 'CONFLICT'].map((status) => [status, rows.filter((row) => row.STATUS === status).length]));
const missingGroups = [
  ['Akustyka i warunki pomiaru', ['indoorNoise.soundPowerDb', 'outdoorNoise.soundPowerDb', 'outdoorNoise.context']],
  ['Ogrzewanie przy niskiej temperaturze', ['heatingFeatures.lowTempPerformance', 'heatingFeatures.crankcaseHeater', 'heatingClimate']],
  ['Komfort nawiewu i higiena', ['airflow.gentleCooling', 'airflow.nightMode', 'airQuality.filters', 'airQuality.sterilization']],
  ['Sterowanie i integracje', ['controls.app', 'controls.voiceControl', 'controls.modbus', 'controls.bms']],
  ['Design i przypisanie wariantów', ['design.colors', 'design.finish', 'design.dimensions']]
].map(([label, paths]) => ({ label, fields: paths.map((path) => ({ path, missingVariants: completeness.reduce((sum, item) => sum + (item.missing[path] ?? 0), 0) })).filter((item) => item.missingVariants > 0) }));
const summary = {
  asOf, models: models.length, activeModels: models.filter((model) => !model.unavailable).length,
  variants: models.reduce((sum, model) => sum + model.variants.length, 0),
  activeVariants: models.filter((model) => !model.unavailable).reduce((sum, model) => sum + model.variants.length, 0),
  addedParameters: added.size, addedVariantParameters: [...added.values()].filter((item) => item.powerKw !== null).length,
  addedSharedParameters: [...added.values()].filter((item) => item.powerKw === null).length,
  auditRows: rows.length, statusCounts, conflicts: [...conflicts.values()],
  sourceConflictFindings: conflictingSourceFindings.length,
  sourceConflicts: [...sourceConflicts.values()], missingOverview: missingGroups,
  researchFindings: findings.map((item) => ({ ...item, source: sourceText(item) })),
  unpricedCombinations, unavailableImages,
  calculatorCompleteVariants: models.flatMap((model) => model.variants).filter((variant) => ['coolingCapacityKw', 'heatingCapacityKw', 'seer', 'scop'].every((key) => Number.isFinite(variant[key]) && variant[key] > 0)).length,
  completeness: completeness.sort((left, right) => right.percentage - left.percentage),
  sourceIds: [...new Set([
    ...models.flatMap((model) => [model, ...model.variants]).flatMap((item) => Object.values(item.technicalDataSources ?? {}).map((source) => source.sourceId)),
    ...[...observations, ...explicitConflicts, ...findings].flatMap((item) => [item.sourceId, item.otherSourceId].filter(Boolean))
  ])].sort()
};

const escapeCsv = (value) => `"${serialized(value).replaceAll('"', '""')}"`;
const headers = ['MARKA', 'MODEL', 'MOC', 'KOLOR', 'PARAMETR', 'OBECNA_WARTOSC', 'STATUS', 'ZRODLO', 'NOWA_WARTOSC'];
const csv = '\uFEFF' + [headers.map(escapeCsv).join(';'), ...rows.map((row) => headers.map((key) => escapeCsv(row[key])).join(';'))].join('\n') + '\n';
const md = (value) => serialized(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
const report = [
  '# Audyt i research danych produktowych FrigAC', '', `Stan researchu: ${asOf}.`, '',
  'Uzupełnienie sprawności sezonowej KAISAI i źródła: [KAISAI-ENERGY-UPDATE.md](KAISAI-ENERGY-UPDATE.md).', '',
  '## Zakres i znaczenie statusów', '',
  `Katalog: **${summary.models} modeli, ${summary.variants} wariantów mocy**; w tym dostępne: ${summary.activeModels} modeli i ${summary.activeVariants} wariantów.`, '',
  '`VERIFIED` dla zastanych wartości oznacza zgodnie z poleceniem użytkownika „wartość już używana przez stronę i zachowana”. Nie oznacza ponownego potwierdzenia każdej zastanej wartości u producenta. Nowe wartości VERIFIED mają dowód z rejestru źródeł. `MISSING` oznacza null / brak dowodu. `CONFLICT` oznacza różnicę względem zastanej wartości albo jawną sprzeczność źródeł; w drugim przypadku parametr może pozostać null. Obecne wartości pozostają bez zmian.', '',
  'Nie przepisujemy hałasu „od” ani zbiorczej klasy energetycznej serii na wszystkie moce. Ciśnienie i moc akustyczna są osobnymi polami. Brak cechy nie oznacza false. Dane badawcze są dowodami audytu; dane używane przez aplikację pozostają wyłącznie w centralnym lineups.ts.', '',
  `Dodano **${summary.addedParameters} parametrów**: ${summary.addedVariantParameters} przy wariantach i ${summary.addedSharedParameters} wspólnych dla modeli. Liczba dotyczy zapisanych pól, bez mnożenia przez kolory.`, '',
  `Wiersze audytu (obejmują powtórzenia na kombinacje kolorów): VERIFIED ${statusCounts.VERIFIED}, MISSING ${statusCounts.MISSING}, CONFLICT ${statusCounts.CONFLICT}. Pełna tabela: [AUDIT.csv](AUDIT.csv).`, '',
  `Konflikty względem zastanych danych: **${summary.conflicts.length}** unikalnych par wariant / parametr. Osobno udokumentowano **${summary.sourceConflictFindings}** jawnie oznaczone sprzeczności źródeł, dotyczące **${summary.sourceConflicts.length}** par wariant / parametr. Dodatkowe zastrzeżenia opisowe producentów znajdują się w uwagach badawczych; nie są automatycznie zaliczane do tej liczby.`, '',
  `Komplet coolingCapacityKw / heatingCapacityKw / SEER / SCOP: **${summary.calculatorCompleteVariants}/${summary.variants} wariantów**. Algorytmy energii pozostają bez zmian.`, '',
  '## Kompletność danych i pozostałe braki', '',
  'Najważniejsze pozostałe braki według zastosowania w ofercie (liczba wariantów z null):', '',
  ...summary.missingOverview.map((group) => `- **${group.label}:** ${group.fields.map((field) => `${fieldLabels.get(field.path) ?? field.path} — ${field.missingVariants}/${summary.variants}`).join('; ') || 'brak luk w sprawdzonych polach'}.`), '',
  'Procent dotyczy kontraktu TECHNICAL_FIELDS na wariant (bez powielania przez kolory); obejmuje także kontekst pomiarów i pola opcjonalne. Nie jest oceną jakości urządzenia. Dokładne null znajdują się w CSV i summary.json.', '',
  '| Model | Warianty | Uzupełnione pola / wszystkie | Kompletność |', '| --- | ---: | ---: | ---: |',
  ...summary.completeness.map((item) => `| ${md(item.model)}${item.unavailable ? ' (niedostępny)' : ''} | ${item.variants} | ${item.present}/${item.total} | ${item.percentage}% |`), '',
  ...summary.completeness.flatMap((item) => [`**${item.model}** — nadal brakuje: ${Object.entries(item.missing).map(([path, count]) => `${path} (${count}/${item.variants})`).join(', ') || 'brak'}.`, '']),
  '## Konflikty wymagające ręcznej decyzji', '',
  ...(summary.conflicts.length ? [
    '| Model / moc | Parametr | Zastana wartość | Wartość źródła | Źródło |', '| --- | --- | --- | --- | --- |',
    ...summary.conflicts.map((item) => `| ${md(item.model)} / ${item.powerKw} kW | ${md(item.path)} | ${md(item.currentValue)} | ${md(item.newValue)} | ${md(item.source)}${item.note ? `; ${md(item.note)}` : ''} |`)
  ] : ['Nie stwierdzono udokumentowanych konfliktów w sprawdzonych źródłach. Nie jest to deklaracja ponownej weryfikacji całego katalogu.']), '',
  '## Sprzeczne źródła bez zmiany zastanych wartości', '',
  ...(summary.sourceConflicts.length ? [
    'Poniższe pozycje obejmują także świadomie wstrzymane parametry null. Listy i obiekty są kandydatami ze źródeł, a nie przyjętą wartością techniczną.', '',
    '| Model / moc | Parametr | Przyjęta wartość | Wartości źródeł | Źródło |', '| --- | --- | --- | --- | --- |',
    ...summary.sourceConflicts.map((item) => `| ${md(item.model)} / ${item.powerKw} kW | ${md(item.path)} | ${item.currentValue === null ? 'null' : md(item.currentValue)} | ${md(item.newValue)} | ${md(item.source)}${item.note ? `; ${md(item.note)}` : ''} |`)
  ] : ['Brak jawnie oznaczonych sprzeczności źródeł.']), '',
  '## Niespójności źródeł i uwagi badawcze', '',
  ...summary.researchFindings.map((item) => `- **${[`${item.modelSlug ?? 'Wszystkie modele marki'}${item.powerKw ? ` / ${item.powerKw} kW` : ''}`, item.path, item.status ?? 'uwaga'].filter(Boolean).join(', ')}:** ${[item.locator, item.reason, item.note].filter(Boolean).join(' ')}${item.values ? ` Wartości: ${md(item.values)}.` : ''}${item.sourceValue !== undefined ? ` Wartość źródła: ${md(item.sourceValue)}.` : ''}${item.otherSourceValue !== undefined ? ` Inne źródło (${item.otherSourceId}): ${md(item.otherSourceValue)}.` : ''}${item.source ? ` Źródło: ${item.source}.` : ''}`), '',
  ...research.flatMap((document) => (document.notes ?? []).map((note) => `- ${document.brand ?? ''}: ${note}`)), '',
  '## Ceny i zdjęcia do ręcznej weryfikacji', '',
  `Kombinacje bez dokładnej ceny wariantu: **${unpricedCombinations.length}**. Cena całej serii nie zastępuje ceny wybranej mocy.`, '',
  ...unpricedCombinations.map((item) => `- ${item.model}, ${item.powerKw} kW, ${item.color}.`), '',
  `Brakujące przypisania zdjęć lub pliki: **${unavailableImages.length}**.`, '',
  ...unavailableImages.map((item) => `- ${item.model}${item.powerKw ? `, ${item.powerKw} kW` : ''}${item.color ? `, ${item.color}` : ''}${item.path ? `, ${item.path}` : ''}: ${item.reason}.`), '',
  '## Oficjalne źródła wykorzystane do uzupełnień', '',
  ...summary.sourceIds.map((id) => { const source = registry[id]; return `- **${id}** — [${source?.title ?? id}](${source?.url ?? ''})${source?.accessedAt ? `, odczyt ${source.accessedAt}` : ''}.`; }), '',
  'Dokładne lokalizatory tabel i stron są przypisane do każdego nowego pola w technicalDataSources. Konfliktów nie rozstrzygnięto automatycznie. catalog-before.json jest niezmiennym zapisem pierwotnego katalogu; skrypt go nie nadpisuje.', ''
].join('\n');

await mkdir(directory, { recursive: true });
await writeFile(new URL('AUDIT.csv', directory), csv);
await writeFile(new URL('REPORT.md', directory), report);
await writeFile(new URL('summary.json', directory), JSON.stringify(summary, null, 2) + '\n');
console.log(`Audyt: ${summary.models} modeli, ${summary.variants} wariantów; ${summary.addedParameters} dodanych pól, ${summary.conflicts.length} konfliktów zastanych danych oraz ${summary.sourceConflictFindings} sprzeczności źródeł (${summary.sourceConflicts.length} par wariant / parametr). Raport: ${fileURLToPath(new URL('REPORT.md', directory))}`);
