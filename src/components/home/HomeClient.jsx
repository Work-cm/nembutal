'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiArrowUpRight,
  FiShield,
  FiTruck,
  FiLock,
  FiFileText,
  FiPackage,
  FiCheckCircle,
} from 'react-icons/fi';
import ProductCard, { ProductImage } from './ProductCard';
import Reveal, { RevealText, RevealRule } from '@/components/animations/Reveal';
import { PRODUCT_CATEGORIES, categoryHref } from '@/lib/constants/categories';
import { SITE_NAME, SITE_WHATSAPP } from '@/lib/constants/site';
import {
  BESTSELLING_PRODUCTS,
  CODEINE_PRODUCTS,
  LATEST_PRODUCTS,
  BESTSELLER_LIST,
  FEATURED_LIST,
  TOP_RATED_LIST,
  formatPrice,
} from '@/lib/constants/showcase';

const EASE = [0.22, 1, 0.36, 1];

const TRUST_BADGES = [
  {
    Icon: FiShield,
    title: 'Premium Quality Products',
    copy: 'We carefully select our healthcare products from reputable, authorized pharmaceutical suppliers and manufacturers. Every product is handled according to applicable storage requirements, with attention to quality, authenticity, packaging and expiration dates.',
  },
  {
    Icon: FiTruck,
    title: 'Fast & Reliable Delivery',
    copy: 'Timely delivery matters. Orders are processed promptly and handed to reliable shipping partners as quickly as possible. Delivery times vary depending on your location, product availability and the selected shipping method.',
  },
  {
    Icon: FiLock,
    title: 'Secure Payment Options',
    copy: 'Your privacy and financial security are important to us. We provide secure payment options designed to protect your personal and payment information throughout checkout. All transactions run through trusted payment channels.',
  },
];

const WHY_CHOOSE = [
  {
    Icon: FiFileText,
    title: 'No Prescription Needed',
    copy: 'Skip the expensive doctor visits. We connect you with top-tier pharmaceutical options without the need for a traditional script.',
  },
  {
    Icon: FiPackage,
    title: '100% Discreet Packaging',
    copy: 'Your privacy is our priority. Every order is shipped in plain, unmarked packaging with no external indicators of the contents inside.',
  },
  {
    Icon: FiCheckCircle,
    title: 'Authentic Quality',
    copy: 'We source our inventory from verified suppliers to ensure you receive the highest grade products available.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Browse',
    copy: 'Select the medications you require and add them to your cart.',
  },
  {
    step: '02',
    title: 'Checkout',
    copy: 'Complete your order with our secure payment gateway. No medical records required.',
  },
  {
    step: '03',
    title: 'Receive',
    copy: 'Your package arrives discreetly at your specified address.',
  },
];

const ACHIEVEMENTS = [
  { value: '9500', label: 'Satisfied customers served' },
  { value: '9240', label: 'Orders successfully delivered' },
  { value: '99%', label: 'Delivery success rate' },
  { value: '200+', label: 'High-quality meds' },
];

const TESTIMONIALS = [
  {
    text: 'Getting a prescription always felt like jumping through hoops. The codeine I ordered arrived in just 4 days, and the packaging was so plain I almost threw it out by mistake. This is my new go-to.',
    author: 'Michael R.',
    role: 'Austin, Texas',
    avatar: '/images/avatar-1.jpg',
  },
  {
    text: 'After having my second baby, I struggled to lose the extra weight. Diet pills gave me the boost I needed. No embarrassing doctor visits, no judgment. I\'m down 12 pounds in 6 weeks.',
    author: 'Sarah J.',
    role: 'Manchester, United Kingdom',
    avatar: '/images/avatar-2.jpg',
  },
  {
    text: 'I was skeptical about ordering online without a prescription, but the men\'s health medication I ordered works perfectly. Discreet shipping, great customer service, and genuine products.',
    author: 'David K.',
    role: 'Denver, Colorado',
    avatar: '/images/avatar-3.jpg',
  },
  {
    text: 'My package arrived in a plain, unmarked box just as promised. I ordered pain medication for my elderly mother, and it got here within 5 days. The quality is excellent and the price was significantly lower.',
    author: 'Sophie L.',
    role: 'Paris, France',
    avatar: '/images/avatar-1.jpg',
  },
  {
    text: 'Living in Germany, I was worried about customs seizing my order. But everything was handled professionally — my research chemicals arrived in perfect condition within the promised timeframe.',
    author: 'Elena M.',
    role: 'Berlin, Germany',
    avatar: '/images/avatar-2.jpg',
  },
];

const HOME_FAQS = [
  {
    q: 'Do I really need a prescription to order?',
    a: 'No, you do not need a prescription to place an order with us. However, we strongly recommend consulting a healthcare professional before starting any new medication.',
  },
  {
    q: 'How discreet is your packaging?',
    a: '100% discreet. All orders are shipped in plain, unmarked boxes or padded envelopes with no logos, medical symbols, or any indication of the contents inside.',
  },
  {
    q: 'Will my personal information be kept confidential?',
    a: 'Absolutely. We use 256-bit SSL encryption to protect all your data. We do not sell, share, or distribute your personal information to third parties.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Domestic orders typically arrive within 3-7 business days, while international orders may take 7-14 business days. You will receive a tracking number once your order is dispatched.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept major credit cards, bank transfer, Apple Pay, cryptocurrency (Bitcoin, Ethereum), and other private payment methods. All transactions are processed through secure, encrypted gateways.',
  },
  {
    q: 'Are your products authentic and safe?',
    a: 'Yes. We source all products from verified, reputable suppliers and manufacturers. Our inventory is stored in temperature-controlled environments to maintain potency and efficacy.',
  },
];

const LATEST_NEWS = [
  {
    title: 'Phenobarbital Tablets for Seizure Management and Neurological Care',
    excerpt: 'Phenobarbital remains a cornerstone barbiturate anticonvulsant for controlling epilepsy and seizure activity. Learn about therapeutic applications and dosing guidelines.',
    date: 'Aug 17, 2026',
    category: 'Nembutal',
  },
  {
    title: 'Alluvi Retatrutide | Buy GLP-1 Peptide',
    excerpt: 'Alluvi retatrutide represents a triple agonist peptide targeting GLP-1, GIP, and glucagon receptors. Learn how this compound supports metabolic health research.',
    date: 'Aug 17, 2026',
    category: 'Alluvi',
  },
  {
    title: 'Best Painkillers for Back Pain: Selecting Effective Relief',
    excerpt: 'Selecting effective painkillers for back pain requires understanding your specific condition and symptoms. Explore our guide on analgesic treatment paths.',
    date: 'Aug 16, 2026',
    category: 'Painkillers',
  },
];

export default function HomeClient({
  featuredProducts = [],
  codeineProducts = [],
  latestProducts = [],
  bestsellerList = [],
  topRatedList = [],
}) {
  const bestselling = featuredProducts.length > 0 ? featuredProducts.slice(0, 8) : BESTSELLING_PRODUCTS;
  const codeine = codeineProducts.length > 0 ? codeineProducts.slice(0, 8) : CODEINE_PRODUCTS;
  const latest = latestProducts.length > 0 ? latestProducts : LATEST_PRODUCTS;
  const bestsellersCol = bestsellerList.length > 0 ? bestsellerList : BESTSELLER_LIST;
  const featuredCol = featuredProducts.length > 0 ? featuredProducts.slice(0, 4) : FEATURED_LIST;
  const topRated = topRatedList.length > 0 ? topRatedList : TOP_RATED_LIST;

  return (
    <div className="bg-bone">
      <DiscretionBanner />
      <WelcomeSection />
      <TrustBadges />
      <TopCategories />
      <BestsellingProducts products={bestselling} />
      <WhyChoose />
      <HowItWorks />
      <Achievements />
      <CodeineFeatured products={codeine} />
      <ProductColumns latest={latest} bestsellers={bestsellersCol} featured={featuredCol} topRated={topRated} />
      <HomeFaq />
      <LatestNews />
      <Testimonials />
      <ClosingCta />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SectionHeading({ eyebrow, title, copy, action, align = 'left' }) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'grid gap-8 md:grid-cols-[1fr_auto] md:items-end'}>
      <div>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <h2 className={`mt-5 text-[34px] leading-[1.06] text-ink md:text-[48px] ${centered ? '' : 'max-w-2xl'}`}>
          <RevealText text={title} />
        </h2>
        {copy && (
          <Reveal delay={0.15}>
            <p className={`mt-6 text-[15px] leading-[1.75] text-ink-muted ${centered ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
              {copy}
            </p>
          </Reveal>
        )}
      </div>
      {action && !centered && (
        <Reveal delay={0.2} className="md:pb-2">
          {action}
        </Reveal>
      )}
    </div>
  );
}

function DiscretionBanner() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="absolute inset-0">
        <Image
          src="/images/Laboratory-Science.jpg"
          alt="Pharmaceutical laboratory"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="container-editorial relative z-10 py-28 md:py-40">
        <Reveal>
          <span className="text-[11px] font-medium uppercase tracking-editorial text-bone/60">
            Your privacy is our policy
          </span>
        </Reveal>
        <h2 className="mt-6 max-w-2xl text-[34px] leading-[1.06] text-bone-light md:text-[52px]">
          <RevealText text="Ultimate discretion," />
          <RevealText text="delivered straight to you." className="block italic text-amber-light" delay={0.12} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-7 max-w-xl text-[15px] leading-[1.75] text-bone/70">
            100% plain packaging ensures your privacy is never compromised. Nobody knows what is
            inside except you — guaranteed.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-4">
          <Link href="/products" className="btn-primary">
            Shop now
          </Link>
          <Link
            href="/shipping"
            className="inline-flex items-center justify-center border-2 border-bone/40 px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-bone-light transition-colors duration-500 ease-editorial hover:border-bone-light hover:bg-bone-light hover:text-ink"
          >
            About shipping
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function WelcomeSection() {
  return (
    <section className="border-b border-ink/10 py-24 md:py-32">
      <div className="container-editorial grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <Reveal>
            <span className="eyebrow">Welcome to {SITE_NAME}</span>
          </Reveal>
          <h2 className="mt-5 text-[34px] leading-[1.06] text-ink md:text-[46px]">
            <RevealText text="Your reliable" />
            <RevealText text="online pharmacy." className="block italic text-amber-dark" delay={0.12} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 text-[15px] leading-[1.75] text-ink-muted">
              Quality medications you can trust.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-9">
            <Link
              href="/about"
              className="link-underline inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-editorial text-ink"
            >
              Learn more <FiArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <Reveal delay={0.1}>
            <p className="text-[15px] leading-[1.85] text-ink-soft">
              Welcome to {SITE_NAME}, your trusted destination for high-quality medications and
              healthcare products. We are committed to making healthcare more convenient by
              providing access to a wide selection of pharmaceutical products from reputable
              manufacturers. Our goal is to offer a secure, reliable, discreet and customer-focused
              shopping experience, helping you find the medications and wellness products you need
              with confidence.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="text-[15px] leading-[1.85] text-ink-soft">
              Whether you are managing a chronic cough, seeking effective weight management support,
              addressing acute or persistent pain, or prioritizing men&apos;s sexual health,
              {SITE_NAME} provides the specialized solutions you need. From research chemicals to
              everyday wellness essentials, we are dedicated to delivering quality products backed
              by exceptional customer service.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TrustBadges() {
  return (
    <section className="border-b border-ink/10 py-20 md:py-24">
      <div className="container-editorial grid gap-12 md:grid-cols-3 md:gap-10">
        {TRUST_BADGES.map(({ Icon, title, copy }, i) => (
          <Reveal key={title} delay={0.08 * i}>
            <div className="flex h-11 w-11 items-center justify-center border border-ink/15 text-amber-dark">
              <Icon size={18} />
            </div>
            <h3 className="mt-6 text-[22px] leading-tight text-ink">{title}</h3>
            <p className="mt-4 text-[14px] leading-[1.75] text-ink-muted">{copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TopCategories() {
  return (
    <section className="border-b border-ink/10 bg-bone-light py-24 md:py-32">
      <div className="container-editorial">
        <SectionHeading
          eyebrow="Top Category"
          title="Everything you need, in one trusted place."
          copy="From powerful pain relief to male vitality and weight management, find everything you need in one trusted place. All available without a prescription."
          action={
            <Link
              href="/products"
              className="link-underline inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-editorial text-ink"
            >
              View all products <FiArrowUpRight size={14} />
            </Link>
          }
        />

        <div className="mt-16 grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-5">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.value} delay={0.04 * i} className="bg-bone-light">
              <Link
                href={categoryHref(cat.value)}
                className="group flex h-full flex-col justify-between p-6 transition-colors duration-500 ease-editorial hover:bg-bone md:p-8"
              >
                <span className="font-serif text-[13px] text-ink-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mt-10">
                  <h3 className="text-[19px] leading-tight text-ink transition-transform duration-700 ease-editorial group-hover:translate-x-1 md:text-[21px]">
                    {cat.label}
                  </h3>
                  <p className="mt-2 text-[11px] uppercase tracking-editorial text-ink-faint">
                    {cat.count} {cat.count === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-editorial text-ink-muted transition-colors group-hover:text-ink">
                  Shop <FiArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestsellingProducts({ products }) {
  return (
    <section className="border-b border-ink/10 py-24 md:py-32">
      <div className="container-editorial">
        <SectionHeading
          eyebrow="Bestselling Products"
          title="The products our customers trust most."
          copy="From codeine, diet pills, pain medication and research chemicals to men's health — fast, discreet and prescription-free."
        />

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product._id || product.slug} delay={0.06 * (i % 4)}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-20 text-center">
          <Link href="/products" className="btn-secondary group">
            Shop all products
            <FiArrowRight
              className="ml-3 transition-transform duration-500 ease-editorial group-hover:translate-x-1"
              size={15}
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="border-b border-ink/10 bg-bone-light py-24 md:py-32">
      <div className="container-editorial grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal>
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-bone-dark">
            <Image
              src="/images/revmed-headshot3.jpg"
              alt="Pharmaceutical quality control"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-ink/10" />
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
          <Reveal>
            <span className="eyebrow">Why choose {SITE_NAME}?</span>
          </Reveal>
          <h2 className="mt-5 text-[34px] leading-[1.06] text-ink md:text-[46px]">
            <RevealText text="Getting what you need" />
            <RevealText text="shouldn't be a hassle." className="block italic text-amber-dark" delay={0.12} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-ink-muted">
              Whether you are managing chronic pain, focusing on your wellness goals or addressing personal
              health concerns, we provide a seamless solution.
            </p>
          </Reveal>

          <div className="mt-12">
            {WHY_CHOOSE.map(({ Icon, title, copy }, i) => (
              <Reveal key={title} delay={0.08 * i}>
                <div className="grid gap-4 border-t border-ink/10 py-8 md:grid-cols-[40px_1fr_1.4fr] md:gap-8">
                  <Icon size={18} className="mt-1 text-amber-dark" />
                  <h3 className="text-[19px] leading-snug text-ink">{title}</h3>
                  <p className="text-[14px] leading-relaxed text-ink-muted">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <RevealRule />

          <Reveal delay={0.1} className="mt-10">
            <Link
              href="/about"
              className="link-underline inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-editorial text-ink"
            >
              More about us <FiArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-b border-ink/10 py-24 md:py-32">
      <div className="container-editorial">
        <SectionHeading
          eyebrow="How It Works"
          title="Three steps. No unnecessary delays."
          copy="We've streamlined the process to ensure you get what you need without unnecessary delays."
          align="center"
        />

        <div className="mt-16 grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <Reveal key={item.step} delay={0.08 * i} className="bg-bone">
              <div className="flex h-full flex-col p-8 md:p-10">
                <span className="font-serif text-[44px] leading-none text-amber-dark/70">{item.step}</span>
                <h3 className="mt-8 text-[24px] leading-tight text-ink">{item.title}</h3>
                <p className="mt-4 text-[14px] leading-[1.75] text-ink-muted">{item.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <section className="paper-grain relative overflow-hidden border-b border-ink/10 bg-ink py-20 md:py-24">
      <div className="container-editorial relative z-10 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <Reveal>
            <span className="text-[11px] font-medium uppercase tracking-editorial text-bone/50">Our Achievements</span>
          </Reveal>
          <h2 className="mt-6 text-[32px] leading-[1.08] text-bone-light md:text-[42px]">
            <RevealText text="Trusted for quality," />
            <RevealText text="discretion and speed." className="block italic text-amber-light" delay={0.12} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-[15px] leading-[1.75] text-bone/65">
              We proudly serve thousands of customers throughout the USA and Europe with high-quality
              products. Trusted in terms of quality, discretion, and fast delivery. Rated 4.9 stars.
            </p>
          </Reveal>
        </div>

        <dl className="grid grid-cols-2 gap-px border border-bone/15 bg-bone/15">
          {ACHIEVEMENTS.map((stat, i) => (
            <Reveal key={stat.label} delay={0.06 * i} className="bg-ink">
              <div className="p-7 md:p-9">
                <dt className="font-serif text-[34px] leading-none text-bone-light md:text-[40px]">{stat.value}</dt>
                <dd className="mt-3 text-[11px] uppercase tracking-[0.14em] text-bone/50">{stat.label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CodeineFeatured({ products }) {
  return (
    <section className="border-b border-ink/10 bg-bone-light py-24 md:py-32">
      <div className="container-editorial">
        <SectionHeading
          eyebrow="Featured Category"
          title="Codeine — one of our most sought-after lines."
          copy="High-quality codeine phosphate and codeine-based formulations for effective pain relief and cough suppression. Available in various strengths to match your requirements. No prescription needed. Discreet shipping guaranteed."
          action={
            <Link
              href={categoryHref('codeine')}
              className="link-underline inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-editorial text-ink"
            >
              View all codeine <FiArrowUpRight size={14} />
            </Link>
          }
        />

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={0.06 * (i % 4)}>
              <ProductCard product={product} compact />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductList({ title, products, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-6 border-t border-ink/10">
        {products.map((product) => (
          <li key={`${title}-${product.slug}`} className="border-b border-ink/10">
            <Link href={`/products/${product.slug}`} className="group flex items-center gap-5 py-4">
              <span className="relative block h-16 w-16 shrink-0 overflow-hidden bg-bone-dark">
                <ProductImage product={product} sizes="64px" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] text-ink transition-colors duration-300 group-hover:text-amber-dark">
                  {product.name}
                </span>
                <span className="mt-1 block font-serif text-[14px] text-ink-muted">
                  {formatPrice(product) || 'Price on request'}
                </span>
              </span>
              <FiArrowRight size={14} className="shrink-0 text-ink-faint transition-transform duration-500 group-hover:translate-x-1 group-hover:text-ink" />
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function ProductColumns({ latest, bestsellers, featured, topRated }) {
  return (
    <section className="border-b border-ink/10 py-24 md:py-32">
      <div className="container-editorial grid gap-14 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
        <ProductList title="Latest Products" products={latest} />
        <ProductList title="Bestsellers" products={bestsellers} delay={0.08} />
        <ProductList title="Featured Products" products={featured} delay={0.16} />
        <ProductList title="Top Rated" products={topRated} delay={0.24} />
      </div>
    </section>
  );
}

function HomeFaq() {
  return (
    <section className="border-b border-ink/10 bg-bone-light py-24 md:py-32">
      <div className="container-editorial">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know before ordering."
          action={
            <Link
              href="/faq"
              className="link-underline inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-editorial text-ink"
            >
              All FAQs <FiArrowUpRight size={14} />
            </Link>
          }
        />

        <div className="mt-16 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {HOME_FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={0.05 * i}>
              <div className="border-t border-ink/10 pt-6">
                <h3 className="text-[18px] leading-snug text-ink">{faq.q}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-ink-muted">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestNews() {
  return (
    <section className="border-b border-ink/10 py-24 md:py-32">
      <div className="container-editorial">
        <SectionHeading
          eyebrow="Latest News & Industry Updates"
          title="Guides, updates and product insights."
        />

        <div className="mt-16 grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">
          {LATEST_NEWS.map((post, i) => (
            <Reveal key={post.title} delay={0.08 * i} className="bg-bone">
              <article className="flex h-full flex-col p-8">
                <div className="flex items-center gap-4 text-[11px] uppercase tracking-editorial text-ink-faint">
                  <span className="text-amber-dark">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-5 text-[19px] leading-snug text-ink">{post.title}</h3>
                <p className="mt-4 flex-1 text-[14px] leading-[1.75] text-ink-muted">{post.excerpt}</p>
                <Link
                  href="/products"
                  className="link-underline mt-8 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-editorial text-ink"
                >
                  Continue reading <FiArrowRight size={13} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(id);
  }, []);

  const item = TESTIMONIALS[active];

  return (
    <section className="border-b border-ink/10 bg-bone-light py-24 md:py-32">
      <div className="container-editorial">
        <Reveal>
          <span className="eyebrow">Customer Testimonials</span>
        </Reveal>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:gap-20">
          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <p className="text-[26px] leading-[1.35] text-ink md:text-[36px]">&ldquo;{item.text}&rdquo;</p>
                <footer className="mt-10 flex items-center gap-4">
                  <span className="relative h-11 w-11 overflow-hidden rounded-full bg-bone-dark">
                    <Image src={item.avatar} alt={item.author} fill sizes="44px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-[14px] text-ink">{item.author}</span>
                    <span className="block text-[11px] uppercase tracking-editorial text-ink-faint">{item.role}</span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <Reveal delay={0.1} className="flex flex-col justify-end">
            <div className="flex flex-col gap-4">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.author}
                  type="button"
                  onClick={() => setActive(i)}
                  className="group flex items-center gap-4 text-left"
                  aria-label={`Read review from ${t.author}`}
                >
                  <span
                    className={`h-px transition-all duration-700 ease-editorial ${
                      i === active ? 'w-12 bg-amber-dark' : 'w-6 bg-ink/20 group-hover:w-9'
                    }`}
                  />
                  <span
                    className={`text-[12px] uppercase tracking-editorial transition-colors duration-500 ${
                      i === active ? 'text-ink' : 'text-ink-faint group-hover:text-ink-muted'
                    }`}
                  >
                    {t.author}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="paper-grain relative overflow-hidden bg-ink py-28 md:py-36">
      <div className="container-editorial relative z-10 text-center">
        <Reveal>
          <span className="text-[11px] font-medium uppercase tracking-editorial text-bone/50">Get Started</span>
        </Reveal>

        <h2 className="mx-auto mt-8 max-w-3xl text-[36px] leading-[1.05] text-bone-light md:text-[60px]">
          <RevealText text="Order today," />
          <RevealText text="delivered discreetly." className="block italic text-amber-light" delay={0.12} />
        </h2>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-[1.75] text-bone/65">
            Join thousands of customers across the USA and Europe who rely on {SITE_NAME} for certified
            medications and healthcare products.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center rounded-editorial bg-bone-light px-7 py-3 text-[13px] font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-500 ease-editorial hover:bg-amber-light"
          >
            Shop now
          </Link>
          <a
            href={SITE_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-editorial border border-bone/30 px-7 py-3 text-[13px] font-medium uppercase tracking-[0.14em] text-bone-light transition-colors duration-500 ease-editorial hover:border-bone-light hover:bg-bone-light hover:text-ink"
          >
            Chat on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}