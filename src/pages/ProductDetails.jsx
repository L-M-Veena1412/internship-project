import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPriceINR } from '../utils/currency';
import { getBaseVariantWeight, getVariantScaledPrice, getWeightNumericValue } from '../utils/variantPricing';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const productRes = await getProductById(id);
        const productData = productRes.data;
        
        setProduct(productData);
        
        // Fetch related products (same category, excluding current product)
        const allProductsRes = await getProducts();
        const related = allProductsRes.data
          .filter(p => p.category === productData.category && p.id !== productData.id)
          .slice(0, 4);
        
        setRelatedProducts(related);
        setError(null);
      } catch (err) {
        setError('Product not found or failed to load.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = async () => {
    if (product) {
      // Check if product has variants and one is selected
      const hasVariants = product.variants && product.variants.length > 0;
      if (hasVariants && !selectedVariant) {
        showToast('Please select a weight/variant', 'error');
        return;
      }

      // Get the selected variant data to check stock
      if (hasVariants && selectedVariant) {
        const variantData = product.variants.find(v => v.id === selectedVariant);
        if (!variantData || variantData.qty < quantity) {
          showToast('Not enough stock for selected variant', 'error');
          return;
        }
      }

      try {
        await addToCart(product, quantity, selectedVariant);
        showToast('Item added to cart successfully');
      } catch (err) {
        const message = err?.response?.data?.message || 'Failed to add item to cart';
        showToast(message, 'error');
      }
    }
  };
  
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading product details..." />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">{error}</h2>
          <Link to="/shop">
            <Button variant="primary">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sellingPrice = Number(product.price || 0);
  const rawOriginalPrice = Number(
    product.mrp ?? product.originalPrice ?? product.original_price ?? sellingPrice
  );
  const rawDiscount = Number(product.discount ?? product.discount_percentage ?? 0);

  const computedOriginalPrice =
    rawOriginalPrice > sellingPrice
      ? rawOriginalPrice
      : rawDiscount > 0 && sellingPrice > 0
        ? sellingPrice / (1 - rawDiscount / 100)
        : sellingPrice;

  const discountPercent =
    rawDiscount > 0
      ? Math.round(rawDiscount)
      : computedOriginalPrice > sellingPrice && computedOriginalPrice > 0
        ? Math.round(((computedOriginalPrice - sellingPrice) / computedOriginalPrice) * 100)
        : 0;

  const hasDiscount = computedOriginalPrice > sellingPrice && discountPercent > 0;

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const baseVariantWeight = getBaseVariantWeight(product.variants || []);
  const selectedVariantData = hasVariants
    ? product.variants.find((variant) => variant.id === selectedVariant)
    : null;
  const fallbackVariantData = hasVariants
    ? [...product.variants]
        .sort((a, b) => (getWeightNumericValue(a.weight) || Number.MAX_SAFE_INTEGER) - (getWeightNumericValue(b.weight) || Number.MAX_SAFE_INTEGER))[0]
    : null;
  const activeVariantData = selectedVariantData || fallbackVariantData;
  const activeVariantWeight = activeVariantData?.weight || null;

  const displaySellingPrice = hasVariants && activeVariantWeight
    ? getVariantScaledPrice(sellingPrice, activeVariantWeight, baseVariantWeight)
    : sellingPrice;

  const displayOriginalPrice = hasDiscount && hasVariants && activeVariantWeight
    ? getVariantScaledPrice(computedOriginalPrice, activeVariantWeight, baseVariantWeight)
    : computedOriginalPrice;
  
  // Mock additional images for gallery
  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1445282768811-6a790c3c3529?w=600&h=600&fit=crop'
  ];

  const handleImageError = (e) => {
    // Fallback to a placeholder image if the original fails to load
    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop'; // Fresh produce fallback
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <motion.nav
          className="mb-6 sm:mb-8 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" className="hover:text-olive-green transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-olive-green transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product?.name || 'Product'}</span>
        </motion.nav>
        
        {/* Product Details */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-custom bg-white shadow-soft">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-custom border-2 transition-all ${
                    selectedImage === index
                      ? 'border-olive-green shadow-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-olive-green">
                    {formatPriceINR(displaySellingPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {hasDiscount && (
                    <span className="text-base text-gray-500 line-through">
                      {formatPriceINR(displayOriginalPrice)}
                    </span>
                  )}
                  {activeVariantWeight && (
                    <span className="text-sm text-gray-500">for {activeVariantWeight}</span>
                  )}
                  <span className="text-gray-600">per unit</span>
                </div>
              </div>

              {/* Manufacturer Info */}
              {product.manufacturer && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Manufacturer:</span> {product.manufacturer.name}
                  </p>
                </div>
              )}
              
              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
            
            {/* Variant and Quantity Selection */}
            <div className="space-y-4">
              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-dark-text mb-2">
                    Select Weight:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {product.variants.map((variant) => (
                      (() => {
                        const variantSellingPrice = getVariantScaledPrice(sellingPrice, variant.weight, baseVariantWeight);
                        return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          selectedVariant === variant.id
                            ? 'border-olive-green bg-olive-green/10 text-olive-green'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${variant.qty === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={variant.qty === 0}
                      >
                        <div>{variant.weight}</div>
                        <div className="text-xs font-semibold text-olive-green">
                          {formatPriceINR(variantSellingPrice)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {variant.qty > 0 ? `${variant.qty} in stock` : 'Out of stock'}
                        </div>
                      </button>
                        );
                      })()
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 text-gray-600 hover:text-dark-text hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 text-gray-600 hover:text-dark-text hover:bg-gray-100 transition-colors"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="large"
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-4 sm:py-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart - {formatPriceINR(displaySellingPrice * quantity)}
              </Button>
            </div>
              
            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-olive-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">100% Organic</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-olive-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Farm Fresh</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-olive-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">No Pesticides</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-olive-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Sustainably Sourced</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Related Products */}
{relatedProducts.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="mt-12"
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-dark-text">Related Products</h2>
      <span className="text-sm text-olive-green font-medium sm:hidden">Swipe →</span>
    </div>

    {/* Horizontal Scroll Container for Mobile, Grid for Desktop */}
    <div className="flex overflow-x-auto pb-4 gap-4 snap-x no-scrollbar lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 sm:gap-6">
      {relatedProducts.map((relatedProduct) => (
        <div 
          key={relatedProduct.id} 
          className="min-w-[70%] sm:min-w-[45%] lg:min-w-0 snap-start"
        >
          <ProductCard product={relatedProduct} />
        </div>
      ))}
    </div>
  </motion.div>
)}
      </div>
    </div>
  );
};

export default ProductDetails;
