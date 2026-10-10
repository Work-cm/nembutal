'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { useCart } from '@/components/cart/CartProvider';
import { categoryLabel } from '@/lib/constants/categories';
import { formatPrice } from '@/lib/constants/showcase';

export function ProductImage({ product, sizes, className = '' }) {
  const [failed, setFailed] = useState(false);
  const src = product?.images?.[0];

  if (!src || failed) {
    const initials = String(product?.name || '?')
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-bone-dark ${className}`}>
        <span className="font-serif text-[40px] leading-none text-ink/25">{initials}</span>
        <span className="text-[10px] uppercase tracking-editorial text-ink-faint">Image coming soon</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={product.name}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className={`object-cover transition-transform duration-[1.1s] ease-editorial group-hover:scale-[1.05] ${className}`}
    />
  );
}

export function Stars({ rating = 0 }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-[11px] ${n <= Math.round(rating) ? 'text-amber-dark' : 'text-ink/20'}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart();
  const price = formatPrice(product);
  const inStock = (product.countInStock ?? 0) > 0;
  const href = `/products/${product.slug}`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (price) addToCart(product, 1);
  };

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={href}
        className={`relative block w-full overflow-hidden bg-bone-dark ${compact ? 'aspect-square' : 'aspect-[4/5]'}`}
      >
        <ProductImage
          product={product}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {!inStock && (
          <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-[10px] uppercase tracking-editorial text-bone-light">
            Out of stock
          </span>
        )}

        {inStock && price && (
          <motion.button
            type="button"
            onClick={handleAdd}
            whileTap={{ scale: 0.94 }}
            className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center bg-bone-light text-ink opacity-0 shadow-editorial transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ink hover:text-bone-light"
            aria-label={`Add ${product.name} to cart`}
          >
            <FiPlus size={18} />
          </motion.button>
        )}
      </Link>

      <div className="mt-5 flex flex-1 flex-col">
        <span className="text-[10px] uppercase tracking-editorial text-ink-faint">
          {categoryLabel(product.category) || product.category}
        </span>

        <h3 className={`mt-2.5 leading-tight text-ink ${compact ? 'text-[16px]' : 'text-[19px]'}`}>
          <Link href={href} className="link-underline transition-colors duration-300 hover:text-amber-dark">
            {product.name}
          </Link>
        </h3>

        {!compact && (
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating || 0} />
            <span className="text-[11px] text-ink-faint">
              {product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between border-t border-ink/10 pt-4">
          <span className="font-serif text-[18px] text-ink">{price || 'Price on request'}</span>
          {inStock ? (
            price ? (
              <button
                type="button"
                onClick={handleAdd}
                className="link-underline text-[11px] font-medium uppercase tracking-editorial text-ink-muted transition-colors hover:text-ink"
              >
                Add to cart
              </button>
            ) : (
              <Link
                href={href}
                className="link-underline text-[11px] font-medium uppercase tracking-editorial text-ink-muted transition-colors hover:text-ink"
              >
                Select options
              </Link>
            )
          ) : (
            <span className="text-[11px] uppercase tracking-editorial text-ink-faint">Unavailable</span>
          )}
        </div>
      </div>
    </article>
  );
}
