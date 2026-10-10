'use client';

import Link from 'next/link';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import Reveal, { RevealRule } from '@/components/animations/Reveal';
import { PRODUCT_CATEGORIES, categoryHref } from '@/lib/constants/categories';
import { SITE_NAME, SITE_WORDMARK, SITE_WHATSAPP, SITE_TELEGRAM } from '@/lib/constants/site';
import LogoMark from './LogoMark';

const TOP_CATEGORIES = PRODUCT_CATEGORIES.filter((cat) =>
  ['painkillers', 'codeine', 'research chemicals', 'nembutal', 'benzodiazepines', 'diet pills'].includes(cat.value)
).map((cat) => ({ label: cat.label, href: categoryHref(cat.value) }));

const TOP_PRODUCTS = [
  { label: 'Promethazine Syrup Plain 6.25 mg/5 ml', href: '/products/promethazine-syrup-plain' },
  { label: 'Toseina 2 mg/ml Codeine Syrup', href: '/products/toseina-codeine-syrup' },
  { label: 'Quagen Promethazine with Codeine', href: '/products/buy-quagen-promethazine-codeine' },
  { label: 'Adderall 30mg', href: '/products/buy-adderall-30mg' },
  { label: 'Foundayo 9 mg GLP-1 Tablets', href: '/products/buy-foundayo-9mg-30-tablets' },
];

const RECENT_POSTS = [
  {
    title: 'Phenobarbital Tablets for Seizure Management',
    date: 'August 17, 2026',
    href: '/products/buy-phenobarbital-30mg-28-tablets',
  },
  {
    title: 'Wegovy Doses 0.25mg to 2.4mg',
    date: 'August 17, 2026',
    href: '/products?category=diet pills',
  },
  {
    title: 'Best Painkillers for Back Pain',
    date: 'August 16, 2026',
    href: '/products?category=painkillers',
  },
];

const USEFUL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About Us', href: '/about' },
  { label: 'My Account', href: '/profile' },
];

const SOCIAL = [
  { label: 'Instagram', href: '#', Icon: FiInstagram },
  { label: 'Twitter', href: '#', Icon: FiTwitter },
  { label: 'Facebook', href: '#', Icon: FiFacebook },
];

function LinkColumn({ title, links, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-6 space-y-3.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="link-underline text-[14px] text-ink-soft transition-colors duration-300 hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-bone-light">
      <div className="container-editorial py-20 md:py-24">
        {/* Contact band */}
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <Reveal>
            <span className="eyebrow">Get in touch</span>
            <h2 className="mt-5 max-w-lg text-[34px] leading-[1.08] text-ink md:text-[46px]">
              Questions or need help ordering? Chat with us directly.
            </h2>
          </Reveal>

          <Reveal delay={0.12} className="flex flex-col justify-end">
            <div className="flex flex-wrap gap-4">
              <a
                href={SITE_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3"
              >
                <FaWhatsapp size={18} />
                WhatsApp
              </a>
              <a
                href={SITE_TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-3"
              >
                <FaTelegram size={18} />
                Telegram
              </a>
            </div>
            <p className="mt-4 text-[12px] tracking-wide text-ink-faint">
              We usually respond within a few hours.
            </p>
          </Reveal>
        </div>

        <RevealRule className="my-16" />

        {/* Columns */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 font-serif text-[24px] leading-none text-ink">
              <LogoMark size={30} />
              <span>
                {SITE_WORDMARK.primary}
                <span className="italic text-amber-dark">{SITE_WORDMARK.accent}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-muted">
              {SITE_NAME} – Premium medications delivered discreetly. No prescription needed.
              Secure checkout. Fast shipping worldwide.
            </p>
            <div className="mt-5 flex items-center gap-6">
              <a
                href={SITE_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-2 text-[14px] text-amber-dark"
              >
                <FaWhatsapp size={14} /> WhatsApp
              </a>
              <a
                href={SITE_TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-2 text-[14px] text-amber-dark"
              >
                <FaTelegram size={14} /> Telegram
              </a>
            </div>
            <div className="mt-8 flex items-center gap-5">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-ink-faint transition-colors duration-300 hover:text-ink"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="eyebrow">Recent Posts</h3>
            <ul className="mt-6 space-y-4">
              {RECENT_POSTS.map((post) => (
                <li key={post.title}>
                  <Link
                    href={post.href}
                    className="block text-[14px] leading-snug text-ink-soft transition-colors duration-300 hover:text-ink"
                  >
                    {post.title}
                  </Link>
                  <span className="mt-1 block text-[11px] uppercase tracking-editorial text-ink-faint">
                    {post.date}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <LinkColumn title="Top Categories" links={TOP_CATEGORIES} delay={0.16} />

          <div>
            <LinkColumn title="Top Products" links={TOP_PRODUCTS.slice(0, 3)} delay={0.24} />
            <Reveal delay={0.3}>
              <h3 className="eyebrow mt-10">Useful Links</h3>
              <ul className="mt-6 space-y-3.5">
                {USEFUL_LINKS.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="link-underline text-[14px] text-ink-soft transition-colors duration-300 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <RevealRule className="my-14" />

        <div className="flex flex-col gap-4 text-[11px] uppercase tracking-editorial text-ink-faint md:flex-row md:items-center md:justify-between">
          <p>Copyright {new Date().getFullYear()} &copy; {SITE_NAME}</p>
          <p>Secure checkout &middot; No prescription needed &middot; Fast shipping worldwide</p>
        </div>
      </div>
    </footer>
  );
}
