/**
 * SEO Keywords Component
 * Keyword coverage for the store categories:
 * codeine, painkillers, benzodiazepines, diet pills, Foundayo,
 * Alluvi, Nembutal, men sex health, research chemicals and steroids.
 */
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants/site';

export const codeineKeywords = [
  'codeine',
  'promethazine with codeine',
  'codeine linctus',
  'codeine syrup',
  'Actavis promethazine',
  'Akorn promethazine',
  'Quagen promethazine',
  'Hi Tech cough syrup',
  'Makatussin',
  'Toseina codeine syrup',
];

export const painkillerKeywords = [
  'painkillers online',
  'Adderall 30mg',
  'Oxycodone',
  'Tramadol',
  'Percocet',
  'Roxycodone',
  'buy painkillers online',
];

export const benzodiazepineKeywords = [
  'benzodiazepines',
  'Rivotril clonazepam',
  'Clonazolam',
  'Xanax alprazolam',
  'Valium diazepam',
];

export const weightLossKeywords = [
  'diet pills',
  'Adipex phentermine',
  'Foundayo GLP-1 tablets',
  'Alluvi retatrutide',
  'Wegovy semaglutide',
];

export const researchChemicalKeywords = [
  'research chemicals',
  '1B-LSD',
  '1P-LSD',
  '1CP-LSD',
  '4-ACO-DET',
  '4-ACO-MET',
  '4-CMC crystal',
  '4-HO-DET',
  '4-HO-MET',
  '4-HO-MIPT',
];

export const otherKeywords = [
  'Nembutal pentobarbital',
  'Phenobarbital tablets',
  'men sex health',
  'Anadrol oxymetholone',
  'potassium cyanide',
  'buy medications online',
  'online pharmacy no prescription',
  'discreet shipping',
];

export const primaryKeywords = [
  ...codeineKeywords,
  ...painkillerKeywords,
  ...benzodiazepineKeywords,
  ...weightLossKeywords,
  ...researchChemicalKeywords,
];

export const secondaryKeywords = otherKeywords;

export const allKeywords = [...primaryKeywords, ...secondaryKeywords];

// Schema.org structured data for better SEO
export const getProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images?.[0] || '',
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'USD',
    availability: product.countInStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  },
  aggregateRating: product.rating ? {
    '@type': 'AggregateRating',
    ratingValue: product.rating,
    reviewCount: product.numReviews || 0,
  } : undefined,
});

// Organization schema
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
});

// Website schema
export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: 'Buy certified medications and healthcare products online — fast, discreet and prescription-free.',
  url: SITE_URL,
});

export default function SEOKeywords() {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}