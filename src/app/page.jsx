import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';
import HomeClient from '@/components/home/HomeClient';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants/site';

export const revalidate = 0;

// Metadata for SEO
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Buy Certified Medications & Healthcare Products Online`,
  description: SITE_DESCRIPTION,
  keywords: 'buy codeine online, painkillers, benzodiazepines, diet pills, Foundayo GLP-1, Alluvi retatrutide, nembutal, research chemicals, men sex health, steroids, online pharmacy no prescription',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} | Certified Medications & Healthcare Products`,
    description: SITE_DESCRIPTION,
    url: '/',
    type: 'website',
  },
};

async function getHomeProducts() {
  try {
    const conn = await dbConnect();
    if (!conn) return null;

    const [featured, codeine, latest, bestselling, topRated] = await Promise.all([
      Product.find({ featured: true }).limit(8).select('-reviews').lean(),
      Product.find({ category: { $regex: /^codeine$/i } }).limit(8).select('-reviews').lean(),
      Product.find().sort({ createdAt: -1 }).limit(4).select('-reviews').lean(),
      Product.find().sort({ price: -1 }).limit(4).select('-reviews').lean(),
      Product.find().sort({ rating: -1, numReviews: -1 }).limit(4).select('-reviews').lean(),
    ]);

    return JSON.parse(JSON.stringify({ featured, codeine, latest, bestselling, topRated }));
  } catch (error) {
    console.error('Error fetching home products:', error);
    return null;
  }
}

export default async function HomePage() {
  const products = await getHomeProducts();

  return (
    <HomeClient
      featuredProducts={products?.featured || []}
      codeineProducts={products?.codeine || []}
      latestProducts={products?.latest || []}
      bestsellerList={products?.bestselling || []}
      topRatedList={products?.topRated || []}
    />
  );
}
