import { SITE_NAME, SITE_URL } from '@/lib/constants/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}, your trusted source for certified medications and healthcare products. Quality, discretion and fast delivery across the USA and Europe.`,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `About Us | ${SITE_NAME}`,
    description: `Learn about ${SITE_NAME}, your trusted source for certified medications and healthcare products.`,
    url: '/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
