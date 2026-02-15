import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, Truck, Lock, RotateCcw, Shield } from 'lucide-react';
import LazyImage from '../components/LazyImage';
import { cartService } from '../services/CartService';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Cart } from '../models/types';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  usePageMeta('CART');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

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
    navigate('/checkout');
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) setCouponApplied(true);
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 flex gap-4">
                    <div className="w-28 h-28 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-6 h-64">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded mt-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty Cart ────────────────────────────────────────────────
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-[#c17d3c] transition-colors">Home</Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-gray-800 font-medium">Shopping Cart</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-32 h-32 bg-[#c17d3c]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-[#c17d3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="inline-block bg-[#c17d3c] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#a86830] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalSavings = cart.items.reduce((sum, item) => {
    if (item.product.discountPrice) {
      return sum + (item.product.price - item.product.discountPrice) * item.quantity;
    }
    return sum;
  }, 0);

  // ── Cart View ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#c17d3c] transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-800 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-sm text-gray-500 mb-8">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══ LEFT — Cart Items ═══ */}
          <div className="lg:col-span-2 space-y-4">
            {/* Savings banner */}
            {totalSavings > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 flex items-center gap-3">
                <BadgeCheck className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">You are saving <span className="font-bold">₹{totalSavings.toLocaleString()}</span> on this order!</p>
              </div>
            )}

            {cart.items.map((item) => {
              const unitPrice = item.product.discountPrice || item.product.price;
              return (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-5 transition-shadow hover:shadow-md"
                >
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0 w-full sm:w-28 h-28 rounded-lg overflow-hidden bg-gray-50">
                    <LazyImage src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <Link to={`/product/${item.productId}`} className="text-base font-semibold text-gray-800 hover:text-[#c17d3c] transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{item.product.category}</p>

                    {/* Price */}
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span className="text-lg font-bold text-gray-900">₹{unitPrice.toLocaleString()}</span>
                      {item.product.discountPrice && (
                        <>
                          <span className="text-sm text-gray-400 line-through">₹{item.product.price.toLocaleString()}</span>
                          {item.product.discountPercentage && (
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                              {item.product.discountPercentage}% OFF
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-4 py-1.5 border-x border-gray-300 min-w-[3rem] text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item subtotal */}
                  <div className="flex-shrink-0 text-right sm:text-left lg:text-right sm:min-w-[100px]">
                    <p className="text-xs text-gray-400 mb-0.5">Subtotal</p>
                    <p className="text-lg font-bold text-gray-900">₹{item.itemTotal.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ RIGHT — Order Summary ═══ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-4 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              {/* Price breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-gray-800">₹{cart.subtotal.toLocaleString()}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">− ₹{totalSavings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">₹{cart.total.toLocaleString()}</span>
              </div>

              {totalSavings > 0 && (
                <p className="text-xs text-green-600 font-medium text-right">You save ₹{totalSavings.toLocaleString()}</p>
              )}

              {/* Coupon Code */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c17d3c]/40 focus:border-[#c17d3c] outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 text-sm font-semibold text-[#c17d3c] border border-[#c17d3c] rounded-lg hover:bg-[#c17d3c]/5 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-red-500 mt-1">Invalid coupon code</p>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#c17d3c] text-white py-3.5 rounded-lg font-semibold hover:bg-[#a86830] active:scale-[0.98] transition-all text-sm"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-[#c17d3c] hover:text-[#a86830] font-medium text-sm transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust badges */}
              <hr className="border-gray-200" />
              <div className="space-y-2.5">
                {[
                  { icon: <Truck className="w-4 h-4 text-gray-500" />, text: 'Free delivery across Mumbai' },
                  { icon: <Lock className="w-4 h-4 text-gray-500" />, text: 'Secure checkout with multiple payment options' },
                  { icon: <RotateCcw className="w-4 h-4 text-gray-500" />, text: '7-day easy returns & exchanges' },
                  { icon: <Shield className="w-4 h-4 text-gray-500" />, text: 'Manufacturer warranty on all products' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-xs text-gray-500">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
