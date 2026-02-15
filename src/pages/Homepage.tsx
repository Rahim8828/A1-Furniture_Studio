import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Wrench, Shield, RotateCcw, IndianRupee, Sparkles, TreePine, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LazyImage from '../components/LazyImage';
import SkeletonCard from '../components/SkeletonCard';
import { productService } from '../services/ProductService';
import { cartService } from '../services/CartService';
import { wishlistService } from '../services/WishlistService';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Product, Category } from '../models/types';

// ─── Hero Banner Data ───────────────────────────────────────────────
const heroBanners = [
  {
    id: 1,
    title: 'Crafted for Comfort',
    subtitle: 'Premium Collection 2025',
    description: 'Handmade solid-wood furniture with factory-direct pricing. Free delivery across Mumbai.',
    cta: 'Shop Collection',
    ctaLink: '/category/sofa-sets',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=900&fit=crop',
    bgColor: 'from-black/70 via-black/40 to-transparent',
    tag: 'Bestsellers',
  },
  {
    id: 2,
    title: 'Design Your Dream Home',
    subtitle: 'Custom Furniture Studio',
    description: 'Get bespoke furniture built to your exact specifications. Free 3D design consultation.',
    cta: 'Start Customizing',
    ctaLink: '/custom-furniture',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&h=900&fit=crop',
    bgColor: 'from-black/70 via-black/40 to-transparent',
    tag: 'New Service',
  },
  {
    id: 3,
    title: 'Bedroom Makeover Sale',
    subtitle: 'Up to 40% Off',
    description: 'Transform your bedroom with our premium bed sets, wardrobes & dressers.',
    cta: 'Shop Bedroom',
    ctaLink: '/category/beds',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&h=900&fit=crop',
    bgColor: 'from-black/70 via-black/40 to-transparent',
    tag: 'Limited Offer',
  },
];

// ─── Shop by Room Data ──────────────────────────────────────────────
const rooms = [
  { name: 'Living Room', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=660&fit=crop', items: '120+ Products', link: '/category/sofa-sets' },
  { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&h=660&fit=crop', items: '80+ Products', link: '/category/beds' },
  { name: 'Dining Room', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=660&fit=crop', items: '60+ Products', link: '/category/dining-tables' },
  { name: 'Home Office', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=660&fit=crop', items: '45+ Products', link: '/category/office-furniture' },
];

// ─── Budget Range Data ──────────────────────────────────────────────
const budgetRanges = [
  { label: 'Under ₹10K', range: 'Budget Friendly', link: '/category/sofa-sets', color: 'from-emerald-500 to-emerald-700' },
  { label: '₹10K – ₹25K', range: 'Best Value', link: '/category/sofa-sets', color: 'from-[#c17d3c] to-[#a86830]' },
  { label: '₹25K – ₹50K', range: 'Premium', link: '/category/sofa-sets', color: 'from-purple-500 to-purple-700' },
  { label: '₹50K+', range: 'Luxury', link: '/category/sofa-sets', color: 'from-[#2d1b0e] to-[#1a0e08]' },
];

// ─── Testimonial Data ───────────────────────────────────────────────
const testimonials = [
  { name: 'Priya Sharma', location: 'Andheri, Mumbai', text: 'The custom sofa we ordered fits perfectly in our living room. Excellent quality and the delivery was on time!', rating: 5, avatar: 'PS', product: 'Custom L-Shape Sofa' },
  { name: 'Rajesh Patel', location: 'Bandra, Mumbai', text: 'Got my old dining table repaired and polished. It looks brand new! Amazing craftsmanship and attention to detail.', rating: 5, avatar: 'RP', product: 'Table Repair & Polish' },
  { name: 'Amit Desai', location: 'Powai, Mumbai', text: 'Furnished our entire office with A1 Furniture. Professional service, timely delivery, and great quality.', rating: 4, avatar: 'AD', product: 'Office Furniture Set' },
  { name: 'Sneha Kapoor', location: 'Juhu, Mumbai', text: 'The Sheesham wood bed set is gorgeous! Solid build quality and the finish is beautiful. Highly recommend!', rating: 5, avatar: 'SK', product: 'Sheesham King Bed' },
];

const Homepage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [bannerPaused, setBannerPaused] = useState(false);

  usePageMeta('HOME');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, cats] = await Promise.all([
          productService.getFeaturedProducts(8),
          productService.getAllCategories(),
        ]);
        setFeaturedProducts(products);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (bannerPaused) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerPaused]);

  const handleAddToCart = useCallback((productId: string) => {
    cartService.addItem(productId, 1);
  }, []);

  const handleAddToWishlist = useCallback((productId: string) => {
    wishlistService.addItem(productId);
  }, []);

  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  const goToBanner = (index: number) => setCurrentBanner(index);
  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full h-[500px] bg-gray-200 animate-pulse" />
        <div className="container mx-auto px-4 py-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ═══ SECTION 1: HERO BANNER CAROUSEL ═══ */}
      <section
        className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] lg:h-[560px] overflow-hidden"
        onMouseEnter={() => setBannerPaused(true)}
        onMouseLeave={() => setBannerPaused(false)}
      >
        {heroBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor}`} />
            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-4 sm:px-8">
                <div className="max-w-xl">
                  {banner.tag && (
                    <span className="inline-block bg-[#c17d3c] text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wider">
                      {banner.tag}
                    </span>
                  )}
                  <p className="text-white/70 text-sm sm:text-base font-medium tracking-widest uppercase mb-2">
                    {banner.subtitle}
                  </p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md leading-relaxed">
                    {banner.description}
                  </p>
                  <Link
                    to={banner.ctaLink}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#c17d3c] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    {banner.cta}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center transition-all" aria-label="Previous banner">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center transition-all" aria-label="Next banner">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroBanners.map((_, index) => (
            <button key={index} onClick={() => goToBanner(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentBanner ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </section>

      {/* ═══ SECTION 2: TRUST/SERVICE STRIP ═══ */}
      <section className="bg-[#fdf8f0] border-y border-[#f0e6d6]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e8d8c4]">
            {[
              { icon: <Truck className="w-6 h-6 text-[#c17d3c]" />, title: 'Free Delivery', desc: 'Across Mumbai' },
              { icon: <Wrench className="w-6 h-6 text-[#c17d3c]" />, title: 'Expert Assembly', desc: 'Free Installation' },
              { icon: <Shield className="w-6 h-6 text-[#c17d3c]" />, title: '5-Year Warranty', desc: 'On all furniture' },
              { icon: <RotateCcw className="w-6 h-6 text-[#c17d3c]" />, title: 'Easy Returns', desc: '7-day return policy' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 py-4 px-4 md:px-6 justify-center">
                <span className="flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: SHOP BY CATEGORY ═══ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Shop by Category" subtitle="Explore our curated furniture collections" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`} className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3] block">
                <LazyImage src={category.imageUrl} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm md:text-base mb-0.5">{category.name}</h3>
                  <p className="text-white/70 text-xs">{category.productCount} Products</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: PROMOTIONAL DEAL BANNERS ═══ */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/custom-furniture" className="group relative overflow-hidden rounded-xl h-48 md:h-56 block">
              <img src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=700&h=350&fit=crop" alt="Custom Furniture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2d1b0e]/90 to-transparent" />
              <div className="absolute inset-0 flex items-center p-6 md:p-8">
                <div>
                  <span className="text-[#c17d3c] text-xs font-bold uppercase tracking-widest">Bespoke</span>
                  <h3 className="text-white text-2xl md:text-3xl font-bold mt-1 mb-2">Custom Furniture</h3>
                  <p className="text-white/70 text-sm mb-4 max-w-xs">Design your dream piece. Free consultation & 3D preview.</p>
                  <span className="inline-flex items-center gap-1 text-white text-sm font-semibold group-hover:gap-2 transition-all">
                    Get Started <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
            <Link to="/repair-polish" className="group relative overflow-hidden rounded-xl h-48 md:h-56 block">
              <img src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=700&h=350&fit=crop" alt="Repair & Polish" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/90 to-transparent" />
              <div className="absolute inset-0 flex items-center p-6 md:p-8">
                <div>
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Services</span>
                  <h3 className="text-white text-2xl md:text-3xl font-bold mt-1 mb-2">Repair & Polish</h3>
                  <p className="text-white/70 text-sm mb-4 max-w-xs">Restore your beloved furniture. Starting at ₹2,999.</p>
                  <span className="inline-flex items-center gap-1 text-white text-sm font-semibold group-hover:gap-2 transition-all">
                    Book Now <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: TRENDING PRODUCTS ═══ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Trending Now" subtitle="Our most loved pieces this season" ctaText="View All" ctaLink="/category/sofa-sets" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} onProductClick={handleProductClick} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: SHOP BY ROOM ═══ */}
      <section className="py-12 md:py-16 bg-[#fdf8f0]">
        <div className="container mx-auto px-4">
          <SectionHeader title="Shop by Room" subtitle="Find the perfect furniture for every space in your home" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rooms.map((room) => (
              <Link key={room.name} to={room.link} className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-md hover:shadow-xl transition-shadow">
                <LazyImage src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">{room.items}</p>
                  <h3 className="text-white text-xl font-bold mb-3">{room.name}</h3>
                  <span className="inline-flex items-center gap-1 text-white/80 text-sm font-medium group-hover:text-white group-hover:gap-2 transition-all">
                    Explore <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7: SHOP BY BUDGET ═══ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Shop by Budget" subtitle="Quality furniture for every price range" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {budgetRanges.map((budget) => (
              <Link key={budget.label} to={budget.link} className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${budget.color} text-white text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <p className="text-lg md:text-xl font-bold mb-1">{budget.label}</p>
                <p className="text-xs text-white/70">{budget.range}</p>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold border border-white/40 px-3 py-1 rounded-full flex items-center gap-1">Shop Now <ArrowRight className="w-3 h-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8: NEW ARRIVALS ═══ */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader title="New Arrivals" subtitle="Fresh designs just added to our collection" ctaText="See All New" ctaLink="/category/sofa-sets" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={`new-${product.id}`} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} onProductClick={handleProductClick} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 9: WHY CHOOSE US ═══ */}
      <section className="py-12 md:py-16 bg-[#2d1b0e] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose A1 Furniture Studio</h2>
            <p className="text-white/60 max-w-xl mx-auto">Trusted by 5,000+ happy customers across Mumbai since 2010</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <IndianRupee className="w-7 h-7" />, title: 'Factory Direct', desc: 'No middlemen, honest pricing' },
              { icon: <Sparkles className="w-7 h-7" />, title: 'Custom Made', desc: 'Built to your specifications' },
              { icon: <TreePine className="w-7 h-7" />, title: 'Premium Wood', desc: 'Sheesham, Teak & Mango' },
              { icon: <Truck className="w-7 h-7" />, title: 'Free Delivery', desc: 'Across Mumbai city' },
              { icon: <Shield className="w-7 h-7" />, title: '5-Year Warranty', desc: 'Quality guaranteed' },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#c17d3c]/30 transition-colors">{item.icon}</div>
                <h3 className="font-semibold mb-1 text-sm md:text-base">{item.title}</h3>
                <p className="text-white/50 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 10: TESTIMONIALS ═══ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="What Our Customers Say" subtitle="Real stories from real customers" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">"{t.text}"</p>
                <div className="text-xs text-[#c17d3c] font-medium mb-3">Purchased: {t.product}</div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <div className="w-9 h-9 rounded-full bg-[#c17d3c] flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 11: NEWSLETTER ═══ */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#c17d3c] to-[#e09b5a]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Get Exclusive Offers & Updates</h2>
            <p className="text-white/80 text-sm mb-6">Subscribe for 10% off your first order, new arrivals, and special deals</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-gray-400" required />
              <button type="submit" className="bg-[#2d1b0e] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#1a0e08] transition-colors whitespace-nowrap">Subscribe</button>
            </form>
            <p className="text-white/50 text-xs mt-3">No spam, unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Reusable Section Header ────────────────────────────────────────
const SectionHeader = ({ title, subtitle, ctaText, ctaLink }: { title: string; subtitle?: string; ctaText?: string; ctaLink?: string }) => (
  <div className="flex items-end justify-between mb-8 md:mb-10">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
    {ctaText && ctaLink && (
      <Link to={ctaLink} className="hidden sm:inline-flex items-center gap-1 text-[#c17d3c] font-semibold text-sm hover:text-[#a86830] transition-colors whitespace-nowrap group">
        {ctaText}
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Link>
    )}
  </div>
);

export default Homepage;
