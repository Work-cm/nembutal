'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { PRODUCT_CATEGORIES, categoryLabel } from '@/lib/constants/categories';

const EASE = [0.22, 1, 0.36, 1];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'name-asc', label: 'Name, A to Z' },
];

const normalizeCategory = (s) =>
  String(s || '').toLowerCase().trim().replace(/\s+/g, ' ');

const getPrice = (product) => {
  if (product.priceVariants && product.priceVariants.length > 0) {
    return product.priceVariants.reduce(
      (min, variant) => (variant.price < min ? variant.price : min),
      product.priceVariants[0]?.price || 0
    );
  }
  return product.price || 0;
};

export default function ProductList({ initialProducts = [], selectedCategory = '' }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: selectedCategory || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest',
  });

  useEffect(() => {
    setFilters((prev) =>
      prev.category === (selectedCategory || '')
        ? prev
        : { ...prev, category: selectedCategory || '' }
    );
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (filters.category) {
      const wanted = normalizeCategory(filters.category);
      result = result.filter(
        (product) => product.category && normalizeCategory(product.category) === wanted
      );
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    if (filters.minPrice !== '') {
      result = result.filter((product) => getPrice(product) >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== '') {
      result = result.filter((product) => getPrice(product) <= Number(filters.maxPrice));
    }
    if (filters.inStock) {
      result = result.filter((product) => (product.countInStock ?? 0) > 0);
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'price-desc':
        result.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    return result;
  }, [initialProducts, filters, searchQuery]);

  const handleCategoryChange = (value) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set('category', value);
      } else {
        url.searchParams.delete('category');
      }
      window.location.href = url.toString();
      return;
    }
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: filters.category,
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'newest',
    });
  };

  const activeCount =
    (searchQuery ? 1 : 0) +
    (filters.minPrice !== '' ? 1 : 0) +
    (filters.maxPrice !== '' ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-10">
      <div>
        <p className="eyebrow mb-4">Category</p>
        <ul className="space-y-2.5">
          {[{ value: '', label: 'All products' }, ...PRODUCT_CATEGORIES].map((cat) => {
            const active = filters.category === cat.value;
            return (
              <li key={cat.value || 'all'}>
                <button
                  type="button"
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`link-underline text-left text-[14px] transition-colors ${
                    active ? 'is-active text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rule" />

      <div>
        <p className="eyebrow mb-4">Price range</p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={filters.minPrice}
            onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
            placeholder="Min"
            className="editorial-input text-[14px]"
            aria-label="Minimum price"
          />
          <span className="text-ink-faint">&mdash;</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
            placeholder="Max"
            className="editorial-input text-[14px]"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="rule" />

      <div>
        <p className="eyebrow mb-4">Availability</p>
        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-ink-muted transition-colors hover:text-ink">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setFilters((p) => ({ ...p, inStock: e.target.checked }))}
            className="h-4 w-4 rounded-none border-ink/30 bg-transparent text-ink focus:ring-0"
          />
          In stock only
        </label>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="link-underline text-[11px] font-medium uppercase tracking-editorial text-ink-muted hover:text-ink"
        >
          Clear filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="pb-28">
      <div className="rule" />

      <div className="flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between">
        <p className="eyebrow">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          {filters.category ? ` in ${categoryLabel(filters.category)}` : ''}
        </p>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex min-w-[210px] items-center gap-3 border-b border-ink/20 pb-2 focus-within:border-ink">
            <FiSearch className="shrink-0 text-ink-faint" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the catalogue"
              className="w-full border-0 bg-transparent p-0 text-[14px] text-ink placeholder:text-ink-faint focus:ring-0"
              aria-label="Search products"
            />
          </div>

          <label className="flex items-center gap-3">
            <span className="eyebrow">Sort</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}
              className="border-0 border-b border-ink/20 bg-transparent py-1.5 pl-0 pr-7 text-[14px] text-ink focus:border-ink focus:ring-0"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-editorial text-ink-muted transition-colors hover:text-ink lg:hidden"
          >
            <FiSliders aria-hidden="true" />
            Filters
          </button>
        </div>
      </div>

      <div className="rule" />

      <div className="grid grid-cols-1 gap-x-10 gap-y-16 pt-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <FilterPanel />
          </div>
        </aside>

        <div>
          {filteredProducts.length === 0 ? (
            <div className="border border-ink/10 bg-bone-light px-8 py-24 text-center">
              <h2 className="font-serif text-[26px] text-ink">Nothing matches yet</h2>
              <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-ink-muted">
                Try a different search term or widen your price range.
              </p>
              <button type="button" onClick={clearFilters} className="btn-secondary mt-8">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product._id || product.slug}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-y-auto bg-bone-light px-7 py-8 lg:hidden"
            >
              <div className="mb-10 flex items-center justify-between">
                <p className="eyebrow">Filters</p>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <FilterPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
