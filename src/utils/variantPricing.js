const parseWeightToUnit = (weight) => {
  if (!weight && weight !== 0) return null;

  const normalized = String(weight).trim().toLowerCase();
  const match = normalized.match(/^(\d+(?:\.\d+)?)\s*(kg|g|mg|l|ml)$/);
  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2];
  if (!Number.isFinite(value) || value <= 0) return null;

  switch (unit) {
    case 'kg':
      return value * 1000;
    case 'g':
      return value;
    case 'mg':
      return value / 1000;
    case 'l':
      return value * 1000;
    case 'ml':
      return value;
    default:
      return null;
  }
};

export const getBaseVariantWeight = (variants = []) => {
  const parsed = variants
    .map((variant) => parseWeightToUnit(variant?.weight))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (parsed.length === 0) return null;
  return Math.min(...parsed);
};

export const getVariantScaledPrice = (basePrice, weight, baseWeight) => {
  const parsedBasePrice = Number(basePrice || 0);
  if (!Number.isFinite(parsedBasePrice) || parsedBasePrice <= 0) return 0;

  const selectedWeight = parseWeightToUnit(weight);
  if (!Number.isFinite(selectedWeight) || selectedWeight <= 0) return parsedBasePrice;

  if (!Number.isFinite(baseWeight) || baseWeight <= 0) return parsedBasePrice;

  const scaled = parsedBasePrice * (selectedWeight / baseWeight);
  return Number(scaled.toFixed(2));
};

export const getWeightNumericValue = (weight) => parseWeightToUnit(weight);
