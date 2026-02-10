import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { cartService } from '../services/CartService';
import type { Cart } from '../models/types';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const currentCart = cartService.getCart();
      setCart(currentCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    cartService.updateQuantity(productId, newQuantity);
    loadCart();
  };

  const handleRemoveItem = (productId: string) => {
    cartService.removeItem(productId);
    loadCart();
  };

  const handleProceedToCheckout = () => {
    // Navigate to checkout page (to be implemented)
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading cart...</div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it
                up!
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row gap-4 p-6 border-b border-gray-200 last:border-b-0"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.productId}`}
                    className="flex-shrink-0 w-full sm:w-32 h-32"
                  >
                    <LazyImage
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">{item.product.category}</p>

                    {/* Price */}
                    <div className="mt-2">
                      {item.product.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-800">
                            ₹{item.product.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.product.price.toLocaleString()}
                          </span>
                          {item.product.discountPercentage && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {item.product.discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">
                          ₹{item.product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls and Remove Button */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right sm:text-left lg:text-right">
                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{item.itemTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>₹{cart.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Free delivery across Mumbai</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600 mt-3">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Secure checkout with multiple payment options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
