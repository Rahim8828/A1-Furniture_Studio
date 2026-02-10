import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { cartService } from '../services/CartService';
import { checkoutService } from '../services/CheckoutService';
import { authService } from '../services/AuthService';
import type { Cart, Address, ContactInfo, PaymentMethod, Order } from '../models/types';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isBuyNow, setIsBuyNow] = useState(false);

  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    // Check if this is a Buy Now checkout
    const buyNowProduct = location.state?.buyNowProduct;
    
    if (buyNowProduct) {
      // Buy Now checkout - use the product passed in state
      setIsBuyNow(true);
      
      // Create a temporary cart for display purposes
      const tempCart: Cart = {
        id: 'buy-now-temp',
        sessionId: 'buy-now',
        items: [buyNowProduct],
        subtotal: buyNowProduct.itemTotal,
        total: buyNowProduct.itemTotal,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCart(tempCart);
      setLoading(false);
    } else {
      // Regular cart checkout
      loadCart();
    }
    
    prefillUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    // Calculate shipping cost when city changes
    if (deliveryAddress.city) {
      const cost = checkoutService.calculateShipping(deliveryAddress);
      setShippingCost(cost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryAddress.city]);

  const loadCart = () => {
    try {
      const currentCart = cartService.getCart();
      if (!currentCart || currentCart.items.length === 0) {
        // Redirect to cart if empty
        navigate('/cart');
        return;
      }
      setCart(currentCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const prefillUserData = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setContactInfo({
        email: user.email,
        phone: user.phone || '',
      });
      setDeliveryAddress((prev) => ({
        ...prev,
        fullName: user.name,
        phone: user.phone || '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate delivery address
    if (!deliveryAddress.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!deliveryAddress.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
    if (!deliveryAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!deliveryAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!deliveryAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    if (!deliveryAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-()]{10,}$/.test(deliveryAddress.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    // Validate contact info
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!contactInfo.phone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!cart || cart.items.length === 0) {
      return;
    }

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.text-red-600');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const isGuestCheckout = !authService.isAuthenticated();
      
      // Pass clearCart=false for Buy Now to preserve cart contents
      const order = await checkoutService.submitOrder({
        items: cart.items,
        deliveryAddress,
        contactInfo,
        paymentMethod,
        isGuestCheckout,
      }, !isBuyNow); // Don't clear cart if this is Buy Now

      setConfirmedOrder(order);
      setOrderConfirmed(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to place order. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading checkout...</div>
      </div>
    );
  }

  // Order confirmation view
  if (orderConfirmed && confirmedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
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
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We've received your order and will process it shortly.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="text-sm text-gray-600 mb-2">Order Number</div>
                <div className="text-2xl font-bold text-gray-800 mb-4">{confirmedOrder.orderId}</div>
                
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <div className="text-sm text-gray-600">Order Date</div>
                    <div className="font-semibold text-gray-800">
                      {confirmedOrder.orderDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="font-semibold text-gray-800">
                      ₹{confirmedOrder.total.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Payment Method</div>
                    <div className="font-semibold text-gray-800">
                      {confirmedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Estimated Delivery</div>
                    <div className="font-semibold text-gray-800">
                      {confirmedOrder.estimatedDelivery?.toLocaleDateString() || '7-10 days'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-left mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Delivery Address</h3>
                <p className="text-gray-600 text-sm">
                  {confirmedOrder.deliveryAddress.fullName}<br />
                  {confirmedOrder.deliveryAddress.addressLine1}<br />
                  {confirmedOrder.deliveryAddress.addressLine2 && (
                    <>{confirmedOrder.deliveryAddress.addressLine2}<br /></>
                  )}
                  {confirmedOrder.deliveryAddress.city}, {confirmedOrder.deliveryAddress.state} {confirmedOrder.deliveryAddress.pincode}<br />
                  Phone: {confirmedOrder.deliveryAddress.phone}
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                A confirmation email has been sent to {confirmedOrder.contactInfo.email}
              </p>

              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  const total = cart.subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={deliveryAddress.fullName}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    value={deliveryAddress.addressLine1}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, addressLine1: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="House/Flat No., Building Name"
                  />
                  {errors.addressLine1 && <p className="text-red-600 text-sm mt-1">{errors.addressLine1}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    value={deliveryAddress.addressLine2}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, addressLine2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street, Area, Landmark"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter state"
                  />
                  {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={deliveryAddress.phone}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.contactPhone && <p className="text-red-600 text-sm mt-1">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1"
                  />
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-800">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-600">Pay with cash when your order is delivered</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1"
                  />
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-800">Online Payment</div>
                    <div className="text-sm text-gray-600">Pay securely using UPI, Cards, or Net Banking</div>
                  </div>
                </label>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <LazyImage
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <div className="text-sm font-semibold text-gray-800">{item.product.name}</div>
                      <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                      <div className="text-sm font-semibold text-gray-800">
                        ₹{item.itemTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span>₹{shippingCost.toLocaleString()}</span>
                  )}
                </div>
                {shippingCost === 0 && deliveryAddress.city && (
                  <p className="text-xs text-green-600">Free delivery in Mumbai!</p>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>

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
                  <span>Secure checkout</span>
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
                  <span>7-day delivery guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
