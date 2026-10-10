/**
 * Dynamic Sitemap for SEO optimization
 * Covers the storefront, all category listings
 * and every product detail page.
 */

import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';
import { PRODUCT_CATEGORIES, categoryHref } from '@/lib/constants/categories';
import { SITE_URL } from '@/lib/constants/site';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_URL;
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Category listing pages
  const categoryPages = PRODUCT_CATEGORIES.map((cat) => ({
    url: `${baseUrl}${categoryHref(cat.value)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Fetch all products from database
  let productPages = [];
  try {
    await dbConnect();
    const products = await Product.find({}).select('slug updatedAt').lean();
    
    productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages even if database fails
  }

  // Always return at least static pages
  return [...staticPages, ...categoryPages, ...productPages];
}
