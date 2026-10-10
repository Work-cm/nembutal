'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart } from '@/components/cart/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingBag, FiUser, FiX, FiChevronDown, FiTruck } from 'react-icons/fi';
import { PRODUCT_CATEGORIES, categoryHref } from '@/lib/constants/categories';
import { SITE_NAME, SITE_WORDMARK, SITE_TAGLINE } from '@/lib/constants/site';
import LogoMark from './LogoMark';

const EASE = [0.22, 1, 0.36, 1];

const SHOP_LINKS = [
  ...PRODUCT_CATEGORIES.map((cat) => ({ label: cat.label, href: categoryHref(cat.value) })),
  { label: 'All Products', href: '/products' },
];

const PRIMARY_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about' },
  { label: 'Shop', href: '/products', children: SHOP_LINKS },
  { label: 'FAQ', href: '/faq' },
];

const UTILITY_LINKS = [
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'FAQs', href: '/faq' },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [query, setQuery] = useState('');

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const searchInputRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setShopOpen(false);
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const cartCount = cart ? cart.reduce((n, item) => n + item.quantity, 0) : 0;
  const cartTotal = cart
    ? cart.reduce((sum, item) => {
        const price = Number(item.price ?? item.variant?.price ?? item.product?.price ?? 0);
        return sum + price * item.quantity;
      }, 0)
    : 0;

  const submitSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Utility bar */}
      <div className="relative z-[60] bg-ink text-bone">
        <div className="container-editorial flex items-center justify-between gap-6 py-2">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-editorial text-bone/90">
            <FiTruck size={13} className="text-amber-light" aria-hidden="true" />
            Free delivery on all orders over $599
          </p>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Utility">
            {UTILITY_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[10px] font-medium uppercase tracking-editorial text-bone/60 transition-colors hover:text-bone"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-700 ease-editorial ${
          scrolled
            ? 'border-b border-ink/10 bg-bone/90 backdrop-blur-md'
            : 'border-b border-transparent bg-bone'
        }`}
      >
        <div className="container-editorial">
          <div
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-6 transition-all duration-700 ease-editorial ${
              scrolled ? 'py-4' : 'py-6'
            }`}
          >
            {/* Left: wordmark / mobile menu trigger */}
            <Link
              href="/"
              className="group hidden justify-self-start lg:block"
              aria-label={`${SITE_NAME} home`}
            >
              <span className="flex items-center gap-3">
                <LogoMark size={30} />
                <span className="block font-serif text-[22px] leading-none tracking-tight text-ink md:text-[26px]">
                  {SITE_WORDMARK.primary}
                  <span className="italic text-amber-dark">{SITE_WORDMARK.accent}</span>
                </span>
              </span>
              <span className="mt-1.5 block pl-[42px] text-[9px] font-medium uppercase tracking-editorial text-ink-faint transition-colors duration-500 group-hover:text-ink-muted">
                {SITE_TAGLINE}
              </span>
            </Link>

            <Link
              href="/"
              className="group justify-self-start lg:hidden"
              aria-label={`${SITE_NAME} home`}
            >
              <span className="flex items-center gap-2.5">
                <LogoMark size={26} />
                <span className="block font-serif text-[22px] leading-none tracking-tight text-ink">
                  {SITE_WORDMARK.primary}
                  <span className="italic text-amber-dark">{SITE_WORDMARK.accent}</span>
                </span>
              </span>
            </Link>

            {/* Center: desktop nav */}
            <nav className="hidden items-center justify-center gap-8 lg:flex" aria-label="Primary">
              {PRIMARY_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setShopOpen(true)}
                    onMouseLeave={() => setShopOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`link-underline flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-editorial transition-colors duration-300 ${
                        isActive(link.href) ? 'is-active text-ink' : 'text-ink-muted hover:text-ink'
                      }`}
                      aria-haspopup="true"
                      aria-expanded={shopOpen}
                    >
                      {link.label}
                      <FiChevronDown
                        className={`transition-transform duration-500 ease-editorial ${
                          shopOpen ? 'rotate-180' : ''
                        }`}
                        size={13}
                        aria-hidden="true"
                      />
                    </Link>

                    <AnimatePresence>
                      {shopOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="absolute left-0 top-full w-64 pt-5"
                        >
                          <div className="border border-ink/10 bg-bone-light p-2 shadow-editorial">
                            {link.children.map((child, i) => (
                              <motion.div
                                key={child.href}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.04 * i, ease: EASE }}
                              >
                                <Link
                                  href={child.href}
                                  className="group flex items-center justify-between px-4 py-3 text-[13px] text-ink-soft transition-colors duration-300 hover:bg-bone-dark hover:text-ink"
                                >
                                  {child.label}
                                  <span className="h-px w-5 origin-left scale-x-0 bg-amber transition-transform duration-500 ease-editorial group-hover:scale-x-100" />
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`link-underline text-[12px] font-medium uppercase tracking-editorial transition-colors duration-300 ${
                      isActive(link.href) ? 'is-active text-ink' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right: actions */}
            <div className="flex items-center justify-end gap-5 md:gap-7">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex flex-col gap-[5px] py-2 lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <span className="block h-px w-6 bg-ink" />
                <span className="block h-px w-6 bg-ink" />
                <span className="block h-px w-4 bg-ink" />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="text-ink-muted transition-colors duration-300 hover:text-ink"
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
              </button>

              <div
                className="relative hidden md:block"
                onMouseEnter={() => setUserOpen(true)}
                onMouseLeave={() => setUserOpen(false)}
              >
                {user ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-editorial text-ink-muted transition-colors duration-300 hover:text-ink"
                      aria-haspopup="true"
                      aria-expanded={userOpen}
                    >
                      <FiUser size={17} aria-hidden="true" />
                      <span className="hidden lg:inline">{user.name?.split(' ')[0]}</span>
                    </button>

                    <AnimatePresence>
                      {userOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="absolute right-0 top-full w-52 pt-5"
                        >
                          <div className="border border-ink/10 bg-bone-light p-2 shadow-editorial">
                            <Link
                              href="/profile"
                              className="block px-4 py-2.5 text-[13px] text-ink-soft transition-colors hover:bg-bone-dark hover:text-ink"
                            >
                              Profile
                            </Link>
                            {user.isAdmin && (
                              <Link
                                href="/admin"
                                className="block px-4 py-2.5 text-[13px] text-ink-soft transition-colors hover:bg-bone-dark hover:text-ink"
                              >
                                Admin Dashboard
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={logout}
                              className="block w-full px-4 py-2.5 text-left text-[13px] text-ink-soft transition-colors hover:bg-bone-dark hover:text-ink"
                            >
                              Log out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : null}
              </div>

              <Link
                href="/cart"
                className="cart-icon relative flex items-center gap-2 text-ink-muted transition-colors duration-300 hover:text-ink"
                aria-label={`Cart with ${cartCount} items`}
              >
                <span className="relative">
                  <FiShoppingBag size={18} aria-hidden="true" />
                  {mounted && cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="absolute -right-2.5 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-dark px-1 text-[10px] font-medium text-bone-light"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </span>
                <span className="hidden text-[12px] font-medium tracking-wide md:inline">
                  €{cartTotal.toFixed(2)}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search drawer */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="overflow-hidden border-t border-ink/10 bg-bone-light"
            >
              <form onSubmit={submitSearch} className="container-editorial py-8" role="search">
                <label htmlFor="site-search" className="eyebrow mb-3 block">
                  Search products
                </label>
                <div className="flex items-center gap-4 border-b border-ink/25 pb-3 focus-within:border-ink">
                  <input
                    id="site-search"
                    ref={searchInputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. codeine, Adderall, Foundayo, Nembutal"
                    className="w-full border-0 bg-transparent p-0 font-serif text-2xl text-ink placeholder:text-ink-faint focus:ring-0 md:text-3xl"
                  />
                  <button
                    type="submit"
                    className="shrink-0 text-[12px] font-medium uppercase tracking-editorial text-ink-muted transition-colors hover:text-ink"
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      {mounted && (
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed inset-0 z-[70] bg-bone lg:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="container-editorial flex items-center justify-between py-6">
                  <span className="flex items-center gap-2.5 font-serif text-[22px] text-ink">
                    <LogoMark size={26} />
                    <span>
                      {SITE_WORDMARK.primary}
                      <span className="italic text-amber-dark">{SITE_WORDMARK.accent}</span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="text-ink"
                    aria-label="Close menu"
                  >
                    <FiX size={22} />
                  </button>
                </div>

                <div className="container-editorial flex-1 overflow-y-auto pb-12">
                  <nav className="mt-4 flex flex-col" aria-label="Mobile">
                    {PRIMARY_LINKS.filter((l) => !l.children).map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.06 * i, ease: EASE }}
                      >
                        <Link
                          href={link.href}
                          className="block border-b border-ink/10 py-5 font-serif text-3xl text-ink"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
                      className="border-b border-ink/10 py-6"
                    >
                      <span className="eyebrow">Shop</span>
                      <div className="mt-4 flex flex-col gap-3">
                        {SHOP_LINKS.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="text-[15px] text-ink-soft transition-colors hover:text-amber-dark"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>

                    <motion.form
                      onSubmit={submitSearch}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                      className="py-8"
                      role="search"
                    >
                      <label htmlFor="mobile-search" className="eyebrow mb-3 block">
                        Search
                      </label>
                      <input
                        id="mobile-search"
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products"
                        className="editorial-input font-serif text-xl"
                      />
                    </motion.form>

                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
                      className="flex flex-col gap-4 border-t border-ink/10 pt-8"
                    >
                      <Link href="/cart" className="text-[13px] uppercase tracking-editorial text-ink-muted">
                        Cart ({cartCount})
                      </Link>
                      {user ? (
                        <>
                          <Link href="/profile" className="text-[13px] uppercase tracking-editorial text-ink-muted">
                            Profile
                          </Link>
                          {user.isAdmin && (
                            <Link href="/admin" className="text-[13px] uppercase tracking-editorial text-ink-muted">
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={logout}
                            className="text-left text-[13px] uppercase tracking-editorial text-ink-muted"
                          >
                            Log out
                          </button>
                        </>
                      ) : null}
                    </motion.div>
                  </nav>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
