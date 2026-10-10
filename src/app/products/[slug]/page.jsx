'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';
import ProtectedImage from '@/components/common/ProtectedImage';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const gramOptions = [25, 50, 100, 500, 1000];
  const [selectedGrams, setSelectedGrams] = useState(25);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setSelectedVariant(null);

        // Try to determine if the slug is actually a MongoDB ID
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);

        // Choose the appropriate API endpoint based on the slug format
        const endpoint = isMongoId ? `/api/products/id/${slug}` : `/api/products/${slug}`;

        const { data } = await axios.get(endpoint);
        setProduct(data);
        if (data.priceVariants && data.priceVariants.length > 0) {
          setSelectedVariant(data.priceVariants[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Fixed pricing tiers
  const calculateEuroPrice = (grams) => {
    // Fixed prices for each gram option
    const pricingTiers = {
      25: 200,
      50: 300,
      100: 450,
      500: 800,
      1000: 1400,
    };
    
    // Return the price for the selected gram amount
    const price = pricingTiers[grams] || 400;
    return Number(price).toFixed(2);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const hasVariants = product.priceVariants && product.priceVariants.length > 0;
    const isResearchChemical = product.category?.toLowerCase() === 'research chemicals';

    if (hasVariants && selectedVariant) {
      addToCart(product, quantity, { ...selectedVariant, price: Number(selectedVariant.price) });
    } else if (isResearchChemical) {
      const euroPrice = parseFloat(calculateEuroPrice(selectedGrams));
      addToCart(product, quantity, { grams: selectedGrams, price: euroPrice });
    } else {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bone pt-24 flex justify-center items-center">
        <div className="w-12 h-12 border-2 border-amber border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-bone pt-24">
        <div className="container-editorial py-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-medium text-ink mb-4">Product Not Found</h1>
            <p className="text-ink-muted mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Link 
              href="/products" 
              className="inline-flex items-center text-amber-dark hover:text-ink"
            >
              <FaArrowLeft className="mr-2" /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone pt-24 pb-16">
      <div className="container-editorial">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center text-sm text-ink-faint">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-ink transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-ink transition-colors capitalize">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-soft">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <div>
            <div className="relative h-80 md:h-[460px] w-full rounded-editorial overflow-hidden border border-ink/10 bg-bone-light mb-4">
              {product.images && product.images.length > 0 ? (
                <ProtectedImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-ink-faint">No image</span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 w-16 rounded-editorial overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-amber' : 'border-transparent'
                    }`}
                  >
                    <ProtectedImage
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-3">
              <span className="bg-amber text-ink text-[11px] font-medium uppercase tracking-editorial px-2.5 py-1 rounded-editorial">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-ink mb-2">{product.name}</h1>
            {product.casNumber && (
              <p className="text-sm text-ink-muted mb-4">CAS: {product.casNumber}</p>
            )}

            {(product.priceVariants && product.priceVariants.length > 0 && product.category?.toLowerCase() !== 'anabolic steroids') ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium uppercase tracking-editorial text-ink-soft mb-2">Choose an option</h3>
              <select
                className="w-full bg-bone border border-ink/15 rounded-editorial px-3 py-2.5 text-ink focus:outline-none focus:border-amber transition-colors mb-2"
                value={selectedVariant?._id || ''}
                onChange={e => {
                  const variant = product.priceVariants.find(v => v._id === e.target.value);
                  setSelectedVariant(variant || product.priceVariants[0]);
                }}
              >
                {product.priceVariants.map(variant => (
                  <option key={variant._id} value={variant._id}>{variant.label}</option>
                ))}
              </select>
              <div className="text-2xl font-serif font-medium text-amber-dark">
                €{Number(selectedVariant?.price || 0).toFixed(2)}
              </div>
            </div>
            ) : (product.category?.toLowerCase() === 'research chemicals') ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium uppercase tracking-editorial text-ink-soft mb-2">Choose quantity</h3>
              <select
                className="w-full bg-bone border border-ink/15 rounded-editorial px-3 py-2.5 text-ink focus:outline-none focus:border-amber transition-colors mb-2"
                value={selectedGrams}
                onChange={e => setSelectedGrams(Number(e.target.value))}
              >
                {gramOptions.map(g => (
                  <option key={g} value={g}>{g}g</option>
                ))}
              </select>
              <div className="text-2xl font-serif font-medium text-amber-dark">
                €{calculateEuroPrice(selectedGrams)}
                <span className="ml-2 text-base font-sans text-ink-muted">({selectedGrams}g)</span>
              </div>
            </div>
            ) : (
            <div className="mb-6">
              <h3 className="text-sm font-medium uppercase tracking-editorial text-ink-soft mb-2">Price</h3>
              <div className="text-2xl font-serif font-medium text-amber-dark">
                €{typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00'}
              </div>
            </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium uppercase tracking-editorial text-ink-soft mb-2">Quantity</h3>
              <div className="flex items-center rounded-editorial overflow-hidden border border-ink/15 w-fit">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="bg-bone text-ink w-10 h-10 flex items-center justify-center hover:bg-bone-dark transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-bone text-ink text-center w-16 h-10 border-x border-ink/15 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="bg-bone text-ink w-10 h-10 flex items-center justify-center hover:bg-bone-dark transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.countInStock <= 0}
              className={`w-full py-3 px-4 rounded-editorial flex items-center justify-center font-medium mb-4 transition-colors ${
                product.countInStock > 0
                  ? 'bg-ink text-bone-light hover:bg-ink/90'
                  : 'bg-bone-dark text-ink-faint cursor-not-allowed'
              }`}
            >
              <FaShoppingCart className="mr-2" />
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </motion.button>

            {/* Stock status */}
            <div className="mb-6">
              <span className={`text-sm ${product.countInStock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                {product.countInStock > 0
                  ? `In Stock (${product.countInStock} available)`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-serif font-medium text-ink mb-3">Description</h3>
              <div className="text-ink-soft space-y-3 leading-relaxed">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
