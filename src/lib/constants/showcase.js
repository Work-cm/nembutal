const img = (slug, ext = 'jpg') => `/images/products/${slug}-1.${ext}`;

const make = (name, slug, category, price, extra = {}) => ({
  _id: slug,
  name,
  slug,
  category,
  price,
  images: [img(slug)],
  countInStock: 25,
  rating: 4.9,
  numReviews: 0,
  description: '',
  ...extra,
});

export const BESTSELLING_PRODUCTS = [
  make('1B-LSD (25 blotters)', 'buy-1b-lsd-25-blotters', 'research chemicals', 160),
  make('1CP-LSD 100 x 100mcg Drop Bottle', '1cp-lsd-100-x-100mcg-drop-bottle', 'research chemicals', 270),
  make('1CP-LSD 25 x 100mcg Drop Bottle', 'buy-1cp-lsd-25-100mcg-drop-bottle', 'research chemicals', 96, { images: [img('buy-1cp-lsd-25-100mcg-drop-bottle', 'png')] }),
  make('1CP-LSD 50 x 100mcg Drop Bottle', 'buy-1cp-lsd-50-x-100mcg-drop-bottle', 'research chemicals', 154, { images: [img('buy-1cp-lsd-50-x-100mcg-drop-bottle', 'png')] }),
  make('1P-LSD 125 x 10mcg Drop Bottle', 'buy-1p-lsd-25-x-100mcg-drop-bottle', 'research chemicals', 51),
  make('4-ACO-DET | High Purity Research Tryptamine', 'buy-4-aco-det-online', 'research chemicals', 42, { images: [img('buy-4-aco-det-online', 'png')] }),
  make('4-ACO-MET', 'buy-4-aco-met-online', 'research chemicals', 25, { images: [img('buy-4-aco-met-online', 'png')] }),
  make('Adderall 30mg', 'buy-adderall-30mg', 'painkillers', 249, { images: [img('buy-adderall-30mg', 'webp')] }),
];

export const CODEINE_PRODUCTS = [
  make('Actavis Legal Lean Syrup Relaxation Drink', 'actavis-legal-lean-syrup', 'codeine', 115, { priceTo: 390 }),
  make('Actavis Promethazine With Codeine Cough Syrup', 'buy-promethazine-with-codeine', 'codeine', 350, { priceTo: 700 }),
  make('Actavis Promethazine with Codeine Purple Syrup', 'actavis-promethazine-with-codeine-purple-syrup', 'codeine', 150),
  make('Actithiol Mucolitico Antihistaminico Oral Solution', 'actithiol-mucolitico-antihistaminico-oral-solution', 'codeine', 50),
  make('AKA Lean Extreme Relaxation Syrup 2 oz (2 bottles)', 'aka-lean-extreme-relaxation-syrup-2oz-2-bottles-deal', 'codeine', 130),
  make('Akorn Promethazine Hydrochloride & Codeine Phosphate Syrup', 'akorn-promethazine', 'codeine', 250, { priceTo: 500 }),
  make('Codeine Linctus BP 200ml Syrup', 'codeine-linctus-bp-200ml-syrup', 'codeine', 180, { images: [img('codeine-linctus-bp-200ml-syrup', 'webp')] }),
  make('Hi Tech Promethazine Cough Syrup', 'hi-tech-promethazine-cough-syrup', 'codeine', 110, { images: [img('hi-tech-promethazine-cough-syrup', 'png')] }),
];

export const LATEST_PRODUCTS = [
  make('Foundayo 9 mg Oral GLP-1 Tablets', 'buy-foundayo-9mg-30-tablets', 'foundayo', 299, { images: [img('buy-foundayo-9mg-30-tablets', 'png')] }),
  make('Foundayo 5.5 mg Oral GLP-1 Tablets', 'foundayo-5-5-mg-oral-glp-1-tablets', 'foundayo', 299, { images: [img('foundayo-5-5-mg-oral-glp-1-tablets', 'png')] }),
  make('Foundayo 2.5 mg Oral GLP-1 Tablets', 'foundayo-2-5-mg-oral-glp-1-tablets', 'foundayo', 199, { images: [img('foundayo-2-5-mg-oral-glp-1-tablets', 'png')] }),
  make('Foundayo 17.2 Oral GLP-1 Tablets', 'foundayo-17-2-oral-glp-1-tablets', 'foundayo', 299, { images: [img('foundayo-17-2-oral-glp-1-tablets', 'png')] }),
];

export const BESTSELLER_LIST = [
  make('Potassium Cyanide Liquid', 'buy-potassium-cyanide-liquid', 'nembutal', 1500, { priceTo: 2900 }),
  make('Anadrol Oxymetholone - 100 Tablets', 'anadrol-oxymetholone-100-tablets', 'steroids', 1200, { priceTo: 1750 }),
  make('Adderall 5mg', 'buy-adderall-5mg-online', 'painkillers', 1200, { images: [img('buy-adderall-5mg-online', 'webp')] }),
  make('Quagen Promethazine with Codeine Oral Solution', 'buy-quagen-promethazine-codeine', 'codeine', 1000, { priceTo: 4500 }),
];

export const FEATURED_LIST = [
  make('Phenobarbital 30 mg 28 Tablets', 'buy-phenobarbital-30mg-28-tablets', 'nembutal', 200, { priceTo: 1300 }),
  make('Foundayo 5.5 mg Oral GLP-1 Tablets', 'foundayo-5-5-mg-oral-glp-1-tablets', 'foundayo', 299, { images: [img('foundayo-5-5-mg-oral-glp-1-tablets', 'png')] }),
  make('Phenergan Elixir 5mg/5ml Oral Solution 100ml', 'phenergan-elixir-5mg-5ml-oral-solution-100ml', 'codeine', 99),
  make('Adderall 15mg', 'buy-adderall-15mg', 'painkillers', 259, { images: [img('buy-adderall-15mg', 'webp')] }),
];

export const TOP_RATED_LIST = [
  make('Tuscosed Linctus Syrup 125ml', 'buy-tuscosed-linctus-syrup-125ml', 'codeine', 95),
  make('Valium 10mg (Diazepam) Tablets', 'buy-valium-10mg-online', 'benzodiazepines', 85),
  make('Foundayo 9 mg Oral GLP-1 Tablets', 'buy-foundayo-9mg-30-tablets', 'foundayo', 299, { images: [img('buy-foundayo-9mg-30-tablets', 'png')] }),
  make('Makatussin Comp Codeine Syrup', 'makatussin-comp-codeine-syrup', 'codeine', 190, { images: [img('makatussin-comp-codeine-syrup', 'webp')] }),
];

export const MARQUEE_TERMS = [
  'CODEINE',
  'PAINKILLERS',
  'BENZODIAZEPINES',
  'FOUNDAYO GLP-1',
  'ALLUVI RETATRUTIDE',
  'NEMBUTAL',
  'DIET PILLS',
  "MEN'S HEALTH",
  'RESEARCH CHEMICALS',
  'STEROIDS',
];

export const formatPrice = (product) => {
  if (!product || typeof product.price !== 'number' || product.price <= 0) return null;
  const base = `€${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  if (product.priceTo) {
    return `${base} – €${product.priceTo.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
  return base;
};
