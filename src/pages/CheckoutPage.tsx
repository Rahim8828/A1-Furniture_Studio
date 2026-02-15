import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft, Banknote, CreditCard, Lock, Truck, RotateCcw } from 'lucide-react';
import LazyImage from '../components/LazyImage';
import { cartService } from '../services/CartService';
import { checkoutService } from '../services/CheckoutService';
import { authService } from '../services/AuthService';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Cart, Address, ContactInfo, PaymentMethod, Order } from '../models/types';

type Step = 1 | 2 | 3;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  usePageMeta('CHECKOUT');
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);

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
    const buyNowProduct = location.state?.buyNowProduct;
    if (buyNowProduct) {
      setIsBuyNow(true);
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
      loadCart();
    }
    prefillUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
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

    if (!deliveryAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!deliveryAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!deliveryAddress.city.trim()) newErrors.city = 'City is required';
    if (!deliveryAddress.state.trim()) newErrors.state = 'State is required';
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
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!contactInfo.phone.trim()) newErrors.contactPhone = 'Contact phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!cart || cart.items.length === 0) return;

    if (!validateForm()) {
      setCurrentStep(1);
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
      const order = await checkoutService.submitOrder({
        items: cart.items,
        deliveryAddress,
        contactInfo,
        paymentMethod,
        isGuestCheckout,
      }, !isBuyNow);

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

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 h-80" />
              <div className="bg-white rounded-xl p-6 h-40" />
            </div>
            <div className="bg-white rounded-xl p-6 h-64" />
          </div>
        </div>
      </div>
    );
  }

  // ── Order Confirmation ────────────────────────────────────────
  if (orderConfirmed && confirmedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-gray-800 font-medium">Order Confirmed</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 text-center">
              {/* Success icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-500 mb-8">Thank you for your order. We've received your order and will process it shortly.</p>

              {/* Order info card */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <div className="text-center mb-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-[#C6A75E]">{confirmedOrder.orderId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order Date</p>
                    <p className="text-sm font-semibold text-gray-800">{confirmedOrder.orderDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                    <p className="text-sm font-semibold text-gray-800">₹{confirmedOrder.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Payment Method</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {confirmedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Estimated Delivery</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {confirmedOrder.estimatedDelivery?.toLocaleDateString() || '7-10 days'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              <div className="text-left mb-8 bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Delivery Address
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {confirmedOrder.deliveryAddress.fullName}<br />
                  {confirmedOrder.deliveryAddress.addressLine1}<br />
                  {confirmedOrder.deliveryAddress.addressLine2 && <>{confirmedOrder.deliveryAddress.addressLine2}<br /></>}
                  {confirmedOrder.deliveryAddress.city}, {confirmedOrder.deliveryAddress.state} {confirmedOrder.deliveryAddress.pincode}<br />
                  Phone: {confirmedOrder.deliveryAddress.phone}
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                A confirmation email has been sent to <span className="font-medium text-gray-700">{confirmedOrder.contactInfo.email}</span>
              </p>

              <button
                onClick={() => navigate('/')}
                className="bg-[#C6A75E] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#B0914A] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart) return null;

  const total = cart.subtotal + shippingCost;
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const steps = [
    { num: 1 as Step, label: 'Address' },
    { num: 2 as Step, label: 'Payment' },
    { num: 3 as Step, label: 'Review' },
  ];

  // ── InputField helper ─────────────────────────────────────────
  const InputField = ({ id, label, value, onChange, type = 'text', placeholder, error, maxLength, colSpan }: {
    id: string; label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder: string; error?: string; maxLength?: number; colSpan?: boolean;
  }) => (
    <div className={colSpan ? 'md:col-span-2' : ''}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#C6A75E]/30 focus:border-[#C6A75E] ${
          error ? 'border-red-400 bg-red-50/50' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link to="/cart" className="hover:text-[#C6A75E] transition-colors">Cart</Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-800 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-center gap-0 mb-10 max-w-md mx-auto">
          {steps.map((step, index) => (
            <div key={step.num} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.num)}
                className="flex flex-col items-center gap-1.5 group w-full"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= step.num
                    ? 'bg-[#C6A75E] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.num ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    step.num
                  )}
                </div>
                <span className={`text-xs font-medium ${currentStep >= step.num ? 'text-[#C6A75E]' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 -mt-5 ${currentStep > step.num ? 'bg-[#C6A75E]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══ LEFT — Form ═══ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address + Contact */}
            {currentStep === 1 && (
              <>
                {/* Delivery Address */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-7 h-7 bg-[#C6A75E] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    Delivery Address
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField id="fullName" label="Full Name *" value={deliveryAddress.fullName}
                      onChange={(v) => setDeliveryAddress({ ...deliveryAddress, fullName: v })}
                      placeholder="Enter your full name" error={errors.fullName} colSpan />
                    <InputField id="addressLine1" label="Address Line 1 *" value={deliveryAddress.addressLine1}
                      onChange={(v) => setDeliveryAddress({ ...deliveryAddress, addressLine1: v })}
                      placeholder="House/Flat No., Building Name" error={errors.addressLine1} colSpan />
                    <InputField id="addressLine2" label="Address Line 2 (Optional)" value={deliveryAddress.addressLine2 || ''}
                      onChange={(v) => setDeliveryAddress({ ...deliveryAddress, addressLine2: v })}
                      placeholder="Street, Area, Landmark" colSpan />
                    <InputField id="city" label="City *" value={deliveryAddress.city}
                      onChange={(v) => setDeliveryAddress({ ...deliveryAddress, city: v })}
                      placeholder="Enter city" error={errors.city} />
                    <InputField id="state" label="State *" value={deliveryAddress.state}
                      onChange={(v) => setDeliveryAddress({ ...deliveryAddress, state: v })}
                      placeholder="Enter state" error={errors.state} />
                    <InputField id="pincode" label="Pincode *" value={deliveryAddress.pincode}
                      onChange={(v) => setDeliveryAddress({ ...deliveryAddress, pincode: v })}
                      placeholder="6-digit pincode" error={errors.pincode} maxLength={6} />
                    <InputField id="phone" label="Phone Number *" value={deliveryAddress.phone} type="tel"
                      onChange={(v) => setDeliveryAddress({ ...deliveryAddress, phone: v })}
                      placeholder="10-digit mobile number" error={errors.phone} />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-7 h-7 bg-[#C6A75E] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField id="email" label="Email Address *" value={contactInfo.email} type="email"
                      onChange={(v) => setContactInfo({ ...contactInfo, email: v })}
                      placeholder="your.email@example.com" error={errors.email} />
                    <InputField id="contactPhone" label="Contact Phone *" value={contactInfo.phone} type="tel"
                      onChange={(v) => setContactInfo({ ...contactInfo, phone: v })}
                      placeholder="10-digit mobile number" error={errors.contactPhone} />
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto bg-[#C6A75E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B0914A] transition-colors text-sm"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Payment Method</h2>

                  <div className="space-y-3">
                    <label className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'COD' ? 'border-[#C6A75E] bg-[#C6A75E]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="mt-0.5 accent-[#C6A75E]" />
                      <div>
                        <p className="font-semibold text-gray-800">Cash on Delivery (COD)</p>
                        <p className="text-sm text-gray-500 mt-0.5">Pay with cash when your order is delivered</p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'ONLINE' ? 'border-[#C6A75E] bg-[#C6A75E]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="paymentMethod" value="ONLINE" checked={paymentMethod === 'ONLINE'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="mt-0.5 accent-[#C6A75E]" />
                      <div>
                        <p className="font-semibold text-gray-800">Online Payment</p>
                        <p className="text-sm text-gray-500 mt-0.5">Pay securely using UPI, Cards, or Net Banking</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-[#C6A75E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B0914A] transition-colors text-sm"
                  >
                    Review Order <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Review & Place Order */}
            {currentStep === 3 && (
              <>
                {/* Address Summary */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                    <button onClick={() => setCurrentStep(1)} className="text-[#C6A75E] text-sm font-medium hover:underline">Edit</button>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="font-semibold text-gray-800">{deliveryAddress.fullName}</p>
                    <p>{deliveryAddress.addressLine1}</p>
                    {deliveryAddress.addressLine2 && <p>{deliveryAddress.addressLine2}</p>}
                    <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.pincode}</p>
                    <p>Phone: {deliveryAddress.phone}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                    <button onClick={() => setCurrentStep(2)} className="text-[#C6A75E] text-sm font-medium hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {paymentMethod === 'COD' ? <><Banknote className="w-4 h-4 inline mr-1" /> Cash on Delivery</> : <><CreditCard className="w-4 h-4 inline mr-1" /> Online Payment</>}
                  </p>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={submitting}
                    className="flex-1 bg-[#4A2F24] text-white py-3.5 rounded-lg font-semibold hover:bg-[#3A2119] active:scale-[0.98] transition-all text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Placing Order…
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ═══ RIGHT — Order Summary ═══ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-4 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              {/* Items list */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <LazyImage src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-800">₹{item.itemTotal.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200" />

              {/* Pricing */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span>₹{shippingCost.toLocaleString()}</span>
                  )}
                </div>
                {shippingCost === 0 && deliveryAddress.city && (
                  <p className="text-xs text-green-600">Free delivery in Mumbai!</p>
                )}
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
              </div>

              {/* Trust badges */}
              <hr className="border-gray-200" />
              <div className="space-y-2">
                {[
                  { icon: <Lock className="w-4 h-4" />, text: 'Secure checkout' },
                  { icon: <Truck className="w-4 h-4" />, text: '7-day delivery guarantee' },
                  { icon: <RotateCcw className="w-4 h-4" />, text: 'Easy returns & exchanges' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-gray-500">
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

export default CheckoutPage;
