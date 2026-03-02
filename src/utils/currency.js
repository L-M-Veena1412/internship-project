// Currency formatting utilities for Indian Rupees

// Conversion rate: 1 USD = 83 INR (approximate)
const USD_TO_INR_RATE = 83;

/**
 * Convert USD price to INR
 * @param {number} usdPrice - Price in USD
 * @returns {number} - Price in INR
 */
export const convertToINR = (usdPrice) => {
  return Math.round(usdPrice * USD_TO_INR_RATE);
};

/**
 * Format price in INR with proper Indian currency formatting
 * @param {number} price - Price in INR
 * @returns {string} - Formatted price string
 */
export const formatINR = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Convert USD to INR and format
 * @param {number} usdPrice - Price in USD
 * @returns {string} - Formatted INR price
 */
export const formatPriceINR = (usdPrice) => {
  const inrPrice = convertToINR(usdPrice);
  return formatINR(inrPrice);
};

/**
 * Get price range labels in INR
 * @returns {Array} - Array of price range objects with INR labels
 */
export const getPriceRangesINR = () => {
  return [
    { label: 'All Prices', value: '' },
    { label: `Under ${formatINR(1 * USD_TO_INR_RATE)}`, value: '0-1' },
    { label: `${formatINR(1 * USD_TO_INR_RATE)} - ${formatINR(2 * USD_TO_INR_RATE)}`, value: '1-2' },
    { label: `${formatINR(2 * USD_TO_INR_RATE)} - ${formatINR(3 * USD_TO_INR_RATE)}`, value: '2-3' },
    { label: `Over ${formatINR(3 * USD_TO_INR_RATE)}`, value: '3-' }
  ];
};
