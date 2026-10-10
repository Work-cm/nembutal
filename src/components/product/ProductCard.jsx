'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { categoryLabel } from '@/lib/constants/categories';

const EASE = [0.22, 1, 0.36, 1];

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const href = `/products/${product.slug || product._id}`;

  const lowestPrice =
    product.priceVariants && product.priceVariants.length > 0
      ? product.priceVariants.reduce(
          (min, variant) => (variant.price < min ? variant.price : min),
          product.priceVariants[0]?.price || 0
        )
      : product.price || 0;

  const inStock = product.countInStock === undefined || product.countInStock > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col border-b border-ink/10 pb-6"
    >
      <Link
        href={href}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-bone-dark"
        aria-label={`View ${product.name}`}
      >
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name || 'Product image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.1s] ease-editorial group-hover:scale-[1.05]"
            loading="lazy"
            quality={85}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="eyebrow">No image</span>
          </div>
        )}

        <span className="absolute left-4 top-4 bg-bone-light/90 px-2.5 py-1 text-[10px] uppercase tracking-editorial text-ink-muted backdrop-blur-sm">
          {categoryLabel(product.category)}
        </span>

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-bone/80">
            <span className="border border-ink/25 bg-bone-light px-4 py-2 text-[11px] uppercase tracking-editorial text-ink">
              Out of stock
            </span>
          </div>
        )}

        <motion.span
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-bone-light"
          initial={{ opacity: 0, y: 8 }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <FiArrowUpRight className="text-base" aria-hidden="true" />
        </motion.span>
      </Link>

      <div className="mt-5 flex flex-1 flex-col">
        <Link href={href}>
          <h3 className="font-serif text-[21px] leading-tight text-ink transition-colors duration-300 group-hover:text-amber-dark">
            {product.name || 'Unnamed product'}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
            {product.description}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between border-t border-ink/10 pt-4">
          <div>
            <span className="font-serif text-[20px] text-ink">
              €{Number(lowestPrice).toFixed(2)}
            </span>
            {product.priceVariants && product.priceVariants.length > 1 && (
              <span className="ml-1.5 text-[11px] uppercase tracking-editorial text-ink-faint">
                and up
              </span>
            )}
          </div>

          <Link
            href={href}
            className="link-underline text-[11px] font-medium uppercase tracking-editorial text-ink-muted transition-colors hover:text-ink"
          >
            View
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
