import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { productService } from '../services/ProductService';
import { cartService } from '../services/CartService';
import { wishlistService } from '../services/WishlistService';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Product, Category } from '../models/types';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
type GridSize = 3 | 4;

const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 – ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 – ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000 – ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  usePageMeta('CATEGORY', category || categorySlug);

  // Filters & Sort
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categorySlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [cats, categoryProducts] = await Promise.all([
          productService.getAllCategories(),
          productService.getProductsByCategory(categorySlug),
        ]);
        const currentCategory = cats.find((cat) => cat.slug === categorySlug);
        setCategory(currentCategory || null);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
    // Reset filters on category change
    setSortBy('relevance');
    setSelectedPriceRange(null);
    setInStockOnly(false);
  }, [categorySlug]);

  // ── Derived filtered & sorted products ──────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Price filter
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => {
        const price = p.discountPrice ?? p.price;
        return price >= range.min && price < range.max;
      });
    }

    // Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, sortBy, selectedPriceRange, inStockOnly]);

  const activeFilterCount = (selectedPriceRange !== null ? 1 : 0) + (inStockOnly ? 1 : 0);

  const handleAddToCart = (productId: string) => {
    cartService.addItem(productId, 1);
  };

  const handleAddToWishlist = (productId: string) => {
    wishlistService.addItem(productId);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const clearFilters = () => {
    setSelectedPriceRange(null);
    setInStockOnly(false);
  };

  // ── Loading State ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>
        {/* Skeleton header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="h-8 bg-gray-200 rounded w-56 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
        {/* Skeleton grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Category Not Found</h1>
          <p className="text-gray-500 mb-6">The category you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#c17d3c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a86830] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Filter Sidebar (shared between desktop & mobile) ───────────
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Price</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, index) => (
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={selectedPriceRange === index}
                onChange={() => setSelectedPriceRange(selectedPriceRange === index ? null : index)}
                className="w-4 h-4 text-[#c17d3c] border-gray-300 focus:ring-[#c17d3c]"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">Availability</h3>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
            className="w-4 h-4 text-[#c17d3c] border-gray-300 rounded focus:ring-[#c17d3c]"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-900">In Stock Only</span>
        </label>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="text-sm text-[#c17d3c] hover:text-[#a86830] font-medium underline underline-offset-2">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#c17d3c] transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-800 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{category.name}</h1>
          <p className="text-sm text-gray-500">
            {filteredProducts.length} of {products.length} {products.length === 1 ? 'product' : 'products'}
            {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied`}
          </p>
        </div>
      </div>

      {/* Toolbar — Sort & Grid toggle */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#c17d3c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-[#c17d3c] bg-white"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Grid toggle — desktop only */}
          <div className="hidden md:flex items-center gap-1 border border-gray-300 rounded-lg p-0.5">
            <button
              onClick={() => setGridSize(3)}
              className={`p-1.5 rounded-md transition-colors ${gridSize === 3 ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="3-column grid"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="4.5" height="7" rx="1" /><rect x="5.75" y="0" width="4.5" height="7" rx="1" /><rect x="11.5" y="0" width="4.5" height="7" rx="1" />
                <rect x="0" y="9" width="4.5" height="7" rx="1" /><rect x="5.75" y="9" width="4.5" height="7" rx="1" /><rect x="11.5" y="9" width="4.5" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setGridSize(4)}
              className={`p-1.5 rounded-md transition-colors ${gridSize === 4 ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="4-column grid"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="3" height="7" rx="0.75" /><rect x="4.33" y="0" width="3" height="7" rx="0.75" /><rect x="8.66" y="0" width="3" height="7" rx="0.75" /><rect x="13" y="0" width="3" height="7" rx="0.75" />
                <rect x="0" y="9" width="3" height="7" rx="0.75" /><rect x="4.33" y="9" width="3" height="7" rx="0.75" /><rect x="8.66" y="9" width="3" height="7" rx="0.75" /><rect x="13" y="9" width="3" height="7" rx="0.75" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Filters</h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-xl border border-gray-100 p-10 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h2>
                  <p className="text-gray-500 text-sm mb-5">
                    {activeFilterCount > 0
                      ? 'Try adjusting your filters to see more results.'
                      : 'This category is currently empty. Check back soon!'}
                  </p>
                  {activeFilterCount > 0 ? (
                    <button onClick={clearFilters} className="bg-[#c17d3c] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#a86830] transition-colors">
                      Clear Filters
                    </button>
                  ) : (
                    <button onClick={() => navigate('/')} className="bg-[#c17d3c] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#a86830] transition-colors">
                      Browse Other Categories
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={`grid gap-5 ${
                gridSize === 3
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-[300px] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-gray-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg" aria-label="Close filters">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5">
              <FilterPanel />
            </div>
            <div className="p-4 border-t">
              <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-[#c17d3c] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#a86830]">
                Apply Filters ({filteredProducts.length} products)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
