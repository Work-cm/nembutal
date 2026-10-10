'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal, { RevealText, RevealRule } from '@/components/animations/Reveal';
import { PRODUCT_CATEGORIES, categoryHref } from '@/lib/constants/categories';
import { SITE_NAME, SITE_WHATSAPP } from '@/lib/constants/site';

const EASE = [0.22, 1, 0.36, 1];

const PRINCIPLES = [
  {
    number: '01',
    title: 'No prescription needed',
    copy: 'Skip the expensive doctor visits. We connect you with top-tier pharmaceutical options without the need for a traditional script.',
  },
  {
    number: '02',
    title: '100% discreet packaging',
    copy: 'Your privacy is our priority. Every order is shipped in plain, unmarked packaging with no external indicators of the contents inside.',
  },
  {
    number: '03',
    title: 'Authentic quality',
    copy: 'We source our inventory from verified suppliers and manufacturers to ensure you receive the highest grade products available.',
  },
  {
    number: '04',
    title: 'Secure payment',
    copy: 'All transactions run through trusted payment channels with appropriate security measures to protect your personal and payment information.',
  },
];

const FACTS = [
  { value: '10', label: 'Product categories' },
  { value: '4.9', label: 'Customer rating' },
  { value: '24h', label: 'Order processing' },
  { value: 'USA & EU', label: 'Regions served' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bone pt-32">
      <section className="container-editorial">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">About {SITE_NAME}</p>
            </Reveal>
            <h1 className="mt-6 font-serif text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.95] text-ink">
              <RevealText text="Healthcare access" />
              <span className="block italic text-amber-dark">
                <RevealText text="without the hassle" delay={0.2} />
              </span>
            </h1>
          </div>

          <div className="lg:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
              className="max-w-md text-[15px] leading-[1.8] text-ink-muted"
            >
              {SITE_NAME} supplies certified medications and healthcare products — pain
              relief, codeine, benzodiazepines, weight management, men&apos;s health and more.
              Whether you are managing chronic pain, focusing on wellness goals or addressing
              personal health concerns, we provide a seamless solution.
            </motion.p>
          </div>
        </div>

        <Reveal delay={0.2} className="mt-16">
          <div className="relative aspect-[16/7] w-full overflow-hidden bg-bone-dark">
            <Image
              src="/images/Laboratory-Science.jpg"
              alt="Pharmaceutical quality control"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="container-editorial pt-28">
        <RevealRule />
        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
          {FACTS.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 0.08}>
              <p className="font-serif text-[clamp(2rem,4vw,3rem)] leading-none text-ink">
                {fact.value}
              </p>
              <p className="eyebrow mt-3">{fact.label}</p>
            </Reveal>
          ))}
        </div>
        <RevealRule />
      </section>

      <section className="container-editorial pt-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Our promise</p>
              <h2 className="mt-6 font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] leading-tight text-ink">
                Quality, discretion and fast delivery
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.12}>
              <p className="text-[17px] leading-[1.85] text-ink">
                We carefully select our healthcare products from reputable, authorized
                pharmaceutical suppliers and manufacturers. Every product is handled according
                to applicable storage requirements, with attention to quality, authenticity,
                packaging and expiration dates.
              </p>
              <p className="mt-7 text-[15px] leading-[1.85] text-ink-muted">
                Timely delivery matters. Orders are processed promptly and handed over to
                reliable shipping partners as quickly as possible. Delivery times may vary
                depending on your location, product availability and the selected shipping
                method — but every package ships plain, unmarked and tracked.
              </p>
              <p className="mt-7 text-[15px] leading-[1.85] text-ink-muted">
                We proudly serve thousands of customers throughout the USA and Europe. If a
                product you need is not listed, get in touch &mdash; our customer care team
                usually replies within a few hours.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-editorial pt-28">
        <Reveal>
          <p className="eyebrow">Why choose us</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
          {PRINCIPLES.map((item, i) => (
            <Reveal key={item.number} delay={i * 0.08}>
              <div className="border-t border-ink/12 pt-7">
                <span className="font-serif text-[15px] text-amber-dark">
                  {item.number}
                </span>
                <h3 className="mt-4 font-serif text-[24px] leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-[1.8] text-ink-muted">
                  {item.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-editorial pt-28">
        <Reveal>
          <p className="eyebrow">What we carry</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-ink/12 bg-ink/12 md:grid-cols-5">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.value}
              href={categoryHref(cat.value)}
              className="group bg-bone-light px-6 py-10 transition-colors duration-500 hover:bg-bone-dark"
            >
              <span className="font-serif text-[15px] text-amber-dark">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-serif text-[20px] leading-tight text-ink">
                {cat.label}
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-editorial text-ink-faint">
                {cat.count} {cat.count === 1 ? 'product' : 'products'}
              </p>
              <span className="link-underline mt-6 inline-block text-[11px] font-medium uppercase tracking-editorial text-ink-muted group-hover:text-ink">
                Browse
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-editorial py-28">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 border-t border-ink/12 pt-14 md:flex-row md:items-end">
            <h2 className="max-w-xl font-serif text-[clamp(1.9rem,3.6vw,3rem)] leading-tight text-ink">
              Ready to order, or have a question about a product?
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary">
                Shop all products
              </Link>
              <a href={SITE_WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
