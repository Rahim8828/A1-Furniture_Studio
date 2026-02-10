import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/ProductService';
import { cartService } from '../services/CartService';
import { wishlistService } from '../services/WishlistService';
import type { Product } from '../models/types';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [query]);

  const handleAddToCart = (productId: string) => {
    cartService.addItem(productId, 1);
  };

  const handleAddToWishlist = (productId: string) => {
    wishlistService.addItem(productId);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Products</h1>
          <p className="text-gray-600 mb-8">
            Enter a search term to find products.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Results Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}". Try different keywords or browse our categories.
              </p>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Suggestions:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check your spelling</li>
                  <li>• Try more general keywords</li>
                  <li>• Browse our popular categories</li>
                </ul>
              </div>
              <div className="mt-8 space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Categories
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
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
