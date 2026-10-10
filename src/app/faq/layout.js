import { SITE_NAME, SITE_URL } from '@/lib/constants/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `FAQ | ${SITE_NAME} - Frequently Asked Questions`,
  description: `Find answers to frequently asked questions about ordering, payment, shipping and products at ${SITE_NAME}.`,
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: `FAQ | ${SITE_NAME}`,
    description: 'Find answers to frequently asked questions about ordering, shipping, and products.',
    url: '/faq',
    type: 'website',
  },
};

export default function FAQLayout({ children }) {
  return children;
}
