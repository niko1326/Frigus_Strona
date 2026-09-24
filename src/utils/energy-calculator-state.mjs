export const DEFAULT_CALCULATOR_STATE = Object.freeze({
  mode: 'cooling',
  selectedBrand: 'gree',
  selectedModel: '',
  selectedVariant: null,
  area: 30,
  electricityPrice: 1.2,
  coolingUsage: 'standard',
  insulation: 'standard',
  heatingUsage: 'regular'
});

export function createCalculatorState(initial = {}) {
  return { ...DEFAULT_CALCULATOR_STATE, ...initial };
}

export function changeCalculatorMode(state, mode) {
  if (mode !== 'cooling' && mode !== 'heating') return state;
  return { ...state, mode };
}

export function selectCalculatorModel(state, model) {
  const previousPower = state.selectedVariant;
  const matchingVariant = model.variants.find((item) => item.powerKw === previousPower);
  const selectedVariant = matchingVariant?.powerKw ??
    (model.variants.length === 1 ? model.variants[0].powerKw : null);
  return {
    ...state,
    selectedBrand: model.brand,
    selectedModel: model.slug,
    selectedVariant
  };
}

export function stateFromQuery(search, models, baseState = createCalculatorState()) {
  const params = new URLSearchParams(search);
  const requestedModel = models.find((model) => model.slug === params.get('model'));
  let state = baseState;
  if (requestedModel) state = selectCalculatorModel(state, requestedModel);

  const requestedPower = Number(params.get('power'));
  if (requestedModel && Number.isFinite(requestedPower) &&
      requestedModel.variants.some((item) => item.powerKw === requestedPower)) {
    state = { ...state, selectedVariant: requestedPower };
  }

  return changeCalculatorMode(state, params.get('mode'));
}
