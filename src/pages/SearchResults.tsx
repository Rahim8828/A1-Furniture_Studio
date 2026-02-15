import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { productService } from '../services/ProductService';
import { cartService } from '../services/CartService';
import { wishlistService } from '../services/WishlistService';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Product } from '../models/types';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  usePageMeta('SEARCH', query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const results = await productService.searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error('Error loading search results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
    setSortBy('relevance');
  }, [query]);

  const sortedProducts = useMemo(() => {
    const result = [...products];
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
    }
    return result;
  }, [products, sortBy]);

  const handleAddToCart = (productId: string) => {
    cartService.addItem(productId, 1);
  };

  const handleAddToWishlist = (productId: string) => {
    wishlistService.addItem(productId);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="h-8 bg-gray-200 rounded w-72 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
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

  // ── No query ───────────────────────────────────────────────────
  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Products</h1>
          <p className="text-gray-500 mb-6">Enter a search term to find furniture, décor, and more.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#C6A75E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B0914A] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-800 font-medium">Search: "{query}"</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Results for "{query}"
          </h1>
          <p className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      {/* Toolbar */}
      {products.length > 0 && (
        <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <span className="text-sm text-gray-500 hidden sm:inline mr-2">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#C6A75E]/30 focus:border-[#C6A75E] bg-white"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border border-gray-100 p-10 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h2>
              <p className="text-gray-500 text-sm mb-5">
                We couldn't find any products matching "{query}".
              </p>
              <div className="text-left bg-gray-50 rounded-lg p-4 mb-5">
                <p className="text-xs font-semibold text-gray-700 mb-2">Suggestions:</p>
                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                  <li>Check your spelling</li>
                  <li>Try more general keywords</li>
                  <li>Browse our popular categories</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-[#C6A75E] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#B0914A] transition-colors"
              >
                Browse Categories
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedProducts.map((product) => (
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
  );
};

export default SearchResults;
