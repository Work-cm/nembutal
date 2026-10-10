/**
 * Single source of truth for the product categories used across the store.
 * `value` is what is persisted on the product document and used in the
 * `?category=` query string; `label` is what is shown to users.
 */
export const PRODUCT_CATEGORIES = [
  { value: 'alluvi', label: 'Alluvi', count: 9 },
  { value: 'benzodiazepines', label: 'Benzodiazepines', count: 8 },
  { value: 'codeine', label: 'Codeine', count: 39 },
  { value: 'diet pills', label: 'Diet Pills', count: 9 },
  { value: 'foundayo', label: 'Foundayo Weight Loss Pill', count: 6 },
  { value: 'men sex health', label: 'Men Sex Health', count: 5 },
  { value: 'nembutal', label: 'Nembutal', count: 12 },
  { value: 'painkillers', label: 'Painkillers', count: 24 },
  { value: 'research chemicals', label: 'Research Chemicals', count: 16 },
  { value: 'steroids', label: 'Steroids', count: 1 },
];

export const PRODUCT_CATEGORY_VALUES = PRODUCT_CATEGORIES.map((c) => c.value);

export const DEFAULT_CATEGORY = 'painkillers';

export const categoryHref = (value) => `/products?category=${encodeURIComponent(value)}`;

export const categoryLabel = (value) => {
  if (!value) return '';
  const match = PRODUCT_CATEGORIES.find(
    (c) => c.value === String(value).toLowerCase()
  );
  return match
    ? match.label
    : String(value)
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};
