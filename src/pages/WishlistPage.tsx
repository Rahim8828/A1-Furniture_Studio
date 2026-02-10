import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wishlistService } from '../services/WishlistService';
import { cartService } from '../services/CartService';
import type { Product } from '../models/types';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading wishlist...</div>
      </div>
    );
  }

  // Empty wishlist state
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-12">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
              <p className="text-gray-600 mb-8">
                Save your favorite furniture items here for easy access later. Start browsing to
                add items to your wishlist!
              </p>
              <Link
                to="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onProductClick={handleProductClick}
              />
              
              {/* Action Buttons Overlay */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleMoveToCart(product.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemoveItem(product.id)}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping Link */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
