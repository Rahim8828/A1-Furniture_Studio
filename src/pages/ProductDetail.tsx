import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TreePine, Scissors, Sparkles, Truck, Wrench, RotateCcw, Shield, Check } from 'lucide-react';
import LazyImage from '../components/LazyImage';
import SkeletonProductDetail from '../components/SkeletonProductDetail';
import { productService } from '../services/ProductService';
import { cartService } from '../services/CartService';
import { wishlistService } from '../services/WishlistService';
import { usePageMeta } from '../hooks/usePageMeta';
import { seoService } from '../services/SEOService';
import type { ProductDetail as ProductDetailType } from '../models/types';

type InfoTab = 'description' | 'specifications' | 'delivery';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<InfoTab>('description');
  const [addedToCart, setAddedToCart] = useState(false);

  usePageMeta('PRODUCT', product);

  // Inject JSON-LD product schema for SEO
  useEffect(() => {
    if (!product) return;
    const schema = seoService.generateProductSchema(product);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema';
    script.textContent = JSON.stringify(schema);
    // Remove existing schema if present
    const existing = document.getElementById('product-schema');
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById('product-schema');
      if (el) el.remove();
    };
  }, [product]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      try {
        const productData = await productService.getProductById(productId);
        setProduct(productData);
        if (productData) {
          setIsInWishlist(wishlistService.isInWishlist(productData.id));
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    setSelectedImageIndex(0);
    setQuantity(1);
    setActiveTab('description');
    setAddedToCart(false);
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      cartService.addItem(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate('/checkout', {
        state: {
          buyNowProduct: {
            productId: product.id,
            product: product,
            quantity,
            priceAtAdd: product.discountPrice || product.price,
            itemTotal: (product.discountPrice || product.price) * quantity,
          },
        },
      });
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist) {
        wishlistService.removeItem(product.id);
        setIsInWishlist(false);
      } else {
        wishlistService.addItem(product.id);
        setIsInWishlist(true);
      }
    }
  };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return <SkeletonProductDetail />;
  }

  // ── Not Found ──────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="bg-[#C6A75E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B0914A] transition-colors">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const savings = hasDiscount ? product.price - displayPrice : 0;
  const images = product.images.length > 0 ? product.images : [{ url: product.imageUrl, alt: product.name, isPrimary: true, order: 1 }];

  const tabs: { id: InfoTab; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'delivery', label: 'Delivery & Warranty' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#C6A75E] transition-colors">{product.category}</Link>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-800 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ═══ LEFT: Image Gallery ═══ */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden aspect-square">
              <LazyImage
                src={images[selectedImageIndex]?.url || product.imageUrl}
                alt={images[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && product.discountPercentage && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {product.discountPercentage}% OFF
                </span>
              )}
              {/* Image nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all"
                    aria-label="Previous image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all"
                    aria-label="Next image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-[#C6A75E] shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <LazyImage src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Product Info ═══ */}
          <div className="lg:sticky lg:top-4 lg:self-start space-y-5">
            {/* Subcategory badge */}
            {product.subcategory && (
              <span className="inline-block text-[11px] font-semibold text-[#C6A75E] bg-[#C6A75E]/10 px-2.5 py-1 rounded uppercase tracking-wider">
                {product.subcategory}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              {product.ratingCount > 0 ? (
                <>
                  <span className="inline-flex items-center gap-1 bg-green-600 text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                    {product.rating.toFixed(1)}
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-500">({product.ratingCount} ratings)</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">No ratings yet</span>
              )}
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Price Section */}
            <div>
              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                <span className="text-3xl font-bold text-gray-900">₹{displayPrice.toLocaleString()}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm font-semibold text-green-600">{product.discountPercentage}% OFF</span>
                  </>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-green-600 mt-1">You save ₹{savings.toLocaleString()} on this order</p>
              )}
              <p className="text-xs text-gray-400 mt-1.5">Inclusive of all taxes · EMI from ₹{Math.round(displayPrice / 12).toLocaleString()}/mo</p>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Materials Quick Highlights */}
            <div className="grid grid-cols-3 gap-3">
              {product.materials.woodType && (
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <TreePine className="w-5 h-5 text-amber-700 mx-auto" />
                  <p className="text-xs font-semibold text-gray-800 mt-1">{product.materials.woodType}</p>
                </div>
              )}
              {product.materials.fabric && (
                <div className="bg-[#F5EFE6] rounded-lg p-3 text-center">
                  <Scissors className="w-5 h-5 text-[#C6A75E] mx-auto" />
                  <p className="text-xs font-semibold text-gray-800 mt-1">{product.materials.fabric}</p>
                </div>
              )}
              {product.materials.polish && (
                <div className="bg-[#F5EFE6] rounded-lg p-3 text-center">
                  <Sparkles className="w-5 h-5 text-orange-600 mx-auto" />
                  <p className="text-xs font-semibold text-gray-800 mt-1">{product.materials.polish}</p>
                </div>
              )}
            </div>

            {/* Dimensions */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Dimensions: </span>
                {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-800 min-w-[40px] text-center border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {/* Stock Status */}
              {product.inStock ? (
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  In Stock
                </span>
              ) : (
                <span className="text-red-500 text-sm font-medium">Out of Stock</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3.5 rounded-lg font-semibold text-sm transition-all ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : product.inStock
                      ? 'bg-[#C6A75E] text-white hover:bg-[#B0914A] active:scale-[0.98]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {addedToCart ? <><Check className="w-4 h-4 inline mr-1" />Added to Cart!</> : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className={`flex-1 py-3.5 rounded-lg font-semibold text-sm transition-all ${
                  product.inStock
                    ? 'bg-[#4A2F24] text-white hover:bg-[#3A2119] active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`w-14 flex-shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
                  isInWishlist
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'
                }`}
                aria-label="Add to wishlist"
              >
                <svg className="w-6 h-6" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Truck className="w-4 h-4 text-[#C6A75E]" />, text: 'Free Delivery in Mumbai' },
                { icon: <Wrench className="w-4 h-4 text-[#C6A75E]" />, text: 'Free Assembly' },
                { icon: <RotateCcw className="w-4 h-4 text-[#C6A75E]" />, text: '7-day Easy Returns' },
                { icon: <Shield className="w-4 h-4 text-[#C6A75E]" />, text: 'Warranty Included' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-xs text-gray-600 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ TABBED INFO SECTION ═══ */}
        <div className="mt-12 md:mt-16 bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-initial px-6 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#C6A75E]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A75E]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'description' && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>

                {/* Materials detail */}
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Materials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {product.materials.woodType && (
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Wood Type</p>
                      <p className="font-semibold text-gray-800">{product.materials.woodType}</p>
                    </div>
                  )}
                  {product.materials.fabric && (
                    <div className="bg-[#F5EFE6] rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fabric</p>
                      <p className="font-semibold text-gray-800">{product.materials.fabric}</p>
                    </div>
                  )}
                  {product.materials.polish && (
                    <div className="bg-[#F5EFE6] rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Polish</p>
                      <p className="font-semibold text-gray-800">{product.materials.polish}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                {/* Dimensions */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dimensions</h3>
                <p className="text-gray-700 mb-6">
                  {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                </p>

                {/* Spec Table */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Specifications</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div key={key} className={`flex ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <span className="w-1/3 px-4 py-3 text-sm font-medium text-gray-600 border-r border-gray-200">{key}</span>
                      <span className="flex-1 px-4 py-3 text-sm text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#C6A75E]" /> Delivery Information
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{product.deliveryInfo}</p>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#C6A75E]" /> Warranty
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{product.warrantyInfo}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
