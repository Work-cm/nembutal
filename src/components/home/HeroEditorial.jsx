'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { RevealText } from '@/components/animations/Reveal';

const EASE = [0.22, 1, 0.36, 1];

const SLIDES = [
  {
    image: '/images/MA_0449a.webp',
    caption: 'Sourced from authorized suppliers',
    label: 'Certified quality',
  },
  {
    image: '/images/revmed-headshot3.jpg',
    caption: 'Plain, unmarked packaging',
    label: '100% discreet',
  },
  {
    image: '/images/GettyImages-563374209.png',
    caption: 'USA & Europe delivery',
    label: 'Fast shipping',
  },
];

const STATS = [
  { value: '10', label: 'Product categories' },
  { value: '4.9', label: 'Customer rating' },
  { value: '24h', label: 'Order processing' },
];

export default function HeroEditorial() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      {/* Background slides */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2, ease: EASE }, scale: { duration: 6.5, ease: 'linear' } }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.label}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/20" />
      </div>

      {/* Banner copy */}
      <div className="container-editorial relative z-10 flex min-h-[82vh] flex-col justify-center py-24 md:min-h-[88vh] md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="inline-flex w-fit items-center gap-2.5 border border-bone/25 bg-bone/10 px-4 py-2 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-light" />
          <span className="text-[11px] font-medium uppercase tracking-editorial text-bone-light">
            Skip the clinic, keep your privacy intact
          </span>
        </motion.div>

        <h1 className="mt-8 max-w-3xl text-[12vw] leading-[0.95] tracking-tight text-bone-light sm:text-[58px] md:text-[72px] lg:text-[84px]">
          <RevealText text="Quality medications" className="block" delay={0.1} />
          <RevealText
            text="at affordable prices."
            className="block italic text-amber-light"
            delay={0.22}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mt-8 max-w-xl text-[15px] leading-[1.75] text-bone/75"
        >
          Skip long clinic queues and enjoy secure access to trusted medications,
          competitive prices, reliable delivery, and exceptional customer service.
          No prescription needed — 100% plain packaging, guaranteed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link href="/products" className="btn-primary group">
            Explore inventory
            <FiArrowRight
              className="ml-3 transition-transform duration-500 ease-editorial group-hover:translate-x-1"
              size={15}
            />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center border-2 border-bone/40 px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-bone-light transition-colors duration-500 ease-editorial hover:border-bone-light hover:bg-bone-light hover:text-ink"
          >
            Contact us
          </Link>
        </motion.div>

        {/* Bottom bar: caption, dots, stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85, ease: EASE }}
          className="mt-auto flex flex-col gap-8 pt-16"
        >
          <div className="flex items-end justify-between gap-6 border-t border-bone/15 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.caption}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <span className="block text-[10px] uppercase tracking-editorial text-bone/60">
                  {slide.label}
                </span>
                <span className="mt-2 block font-serif text-lg text-bone-light">
                  {slide.caption}
                </span>
              </motion.div>
            </AnimatePresence>

            <div className="flex shrink-0 items-center gap-2 pb-1">
              {SLIDES.map((s, i) => (
                <button
                  key={s.image}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`View ${s.label}`}
                  className={`h-px transition-all duration-700 ease-editorial ${
                    i === index ? 'w-8 bg-bone-light' : 'w-4 bg-bone/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <dl className="hidden max-w-lg grid-cols-3 gap-6 md:grid">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-serif text-[26px] leading-none text-bone-light md:text-[30px]">
                  {stat.value}
                </dt>
                <dd className="mt-2.5 text-[11px] uppercase tracking-[0.14em] text-bone/50">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
