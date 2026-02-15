import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { wishlistService } from '../services/WishlistService';
import { cartService } from '../services/CartService';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Product } from '../models/types';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  usePageMeta('WISHLIST');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const items = await wishlistService.getWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    wishlistService.removeItem(productId);
    await loadWishlist();
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      await wishlistService.moveToCart(productId);
      await loadWishlist();
    } catch (error) {
      console.error('Error moving item to cart:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await cartService.addItem(productId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = (productId: string) => {
    wishlistService.toggleItem(productId);
    loadWishlist();
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#c17d3c] rounded-full animate-spin" />
      </div>
    );
  }

  // Empty wishlist state
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-[#c17d3c] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Wishlist</span>
          </nav>

          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-card p-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#c17d3c]/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#c17d3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                Save your favorite furniture items here for easy access later. Start browsing to add items to your wishlist!
              </p>
              <Link
                to="/"
                className="inline-block bg-[#c17d3c] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a86830] transition-colors text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#c17d3c] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Wishlist</span>
        </nav>

        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 text-sm mt-1">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onProductClick={handleProductClick}
              />
              
              {/* Action Buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleMoveToCart(product.id)}
                  className="flex-1 bg-[#2d1b0e] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#1a0e08] transition-colors text-sm"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemoveItem(product.id)}
                  className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[#c17d3c] hover:text-[#a86830] font-medium transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
