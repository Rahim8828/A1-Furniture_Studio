import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
import { cartService } from '../services/CartService';
import { checkoutService } from '../services/CheckoutService';
import { authService } from '../services/AuthService';
import type { Cart, Order } from '../models/types';

// Mock services
vi.mock('../services/CartService');
vi.mock('../services/CheckoutService');
vi.mock('../services/AuthService');

// Mock useNavigate and useLocation
const mockNavigate = vi.fn();
const mockLocation: { state: unknown; pathname: string; search: string; hash: string; key: string } = { 
  state: null, 
  pathname: '/checkout', 
  search: '', 
  hash: '', 
  key: 'default' 
};
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe('CheckoutPage', () => {
  const mockCart: Cart = {
    id: 'cart1',
    sessionId: 'session1',
    items: [
      {
        productId: 'prod1',
        product: {
          id: 'prod1',
          name: 'Modern Sofa',
          slug: 'modern-sofa',
          description: 'A comfortable modern sofa',
          shortDescription: 'Modern sofa',
          price: 25000,
          discountPrice: 20000,
          discountPercentage: 20,
          category: 'Sofas',
          imageUrl: '/images/sofa.jpg',
          rating: 4.5,
          ratingCount: 10,
          inStock: true,
          sku: 'SOF001',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: 2,
        priceAtAdd: 20000,
        itemTotal: 40000,
      },
    ],
    subtotal: 40000,
    total: 40000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.state = null; // Reset location state
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.getCurrentUser).mockReturnValue(null);
    vi.mocked(checkoutService.calculateShipping).mockReturnValue(0);
  });

  const renderCheckoutPage = () => {
    return render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    );
  };

  // Helper to navigate to a specific step
  const goToStep2 = () => {
    fireEvent.click(screen.getByText('Continue to Payment →'));
  };

  const goToStep3 = () => {
    goToStep2();
    fireEvent.click(screen.getByText('Review Order →'));
  };

  it('should display order summary with items and total', () => {
    renderCheckoutPage();

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Modern Sofa')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    // Use getAllByText since the price appears multiple times
    const priceElements = screen.getAllByText(/₹40,000/);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it('should display delivery address form with all required fields', () => {
    renderCheckoutPage();

    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address Line 1/)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
  });

  it('should display contact information form', () => {
    renderCheckoutPage();

    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Phone/)).toBeInTheDocument();
  });

  it('should display payment method selection with COD and Online Payment', () => {
    renderCheckoutPage();
    goToStep2();

    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Cash on Delivery (COD)')).toBeInTheDocument();
    expect(screen.getByText('Online Payment')).toBeInTheDocument();
  });

  it('should have COD selected by default', () => {
    renderCheckoutPage();
    goToStep2();

    const codRadio = screen.getByRole('radio', { name: /Cash on Delivery/i });
    expect(codRadio).toBeChecked();
  });

  it('should allow selecting online payment method', () => {
    renderCheckoutPage();
    goToStep2();

    const onlineRadio = screen.getByRole('radio', { name: /Online Payment/i });
    fireEvent.click(onlineRadio);

    expect(onlineRadio).toBeChecked();
  });

  it('should display Place Order button', () => {
    renderCheckoutPage();
    goToStep3();

    expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument();
  });

  it('should show validation errors when submitting with empty fields', async () => {
    renderCheckoutPage();
    goToStep3();

    const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(placeOrderButton);

    // Validation failure navigates back to step 1 and shows errors
    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Address is required')).toBeInTheDocument();
      expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('State is required')).toBeInTheDocument();
      expect(screen.getByText('Pincode is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should validate pincode format', async () => {
    renderCheckoutPage();

    const pincodeInput = screen.getByLabelText(/Pincode/);
    fireEvent.change(pincodeInput, { target: { value: '123' } });

    goToStep3();

    const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText('Pincode must be 6 digits')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    renderCheckoutPage();

    const emailInput = screen.getByLabelText(/Email Address/);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    goToStep3();

    const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('should submit order with valid data and show confirmation', async () => {
    const mockOrder: Order = {
      id: 'order1',
      orderId: 'A1F-20240115-0001',
      items: [
        {
          productId: 'prod1',
          productName: 'Modern Sofa',
          quantity: 2,
          price: 20000,
          itemTotal: 40000,
        },
      ],
      subtotal: 40000,
      shippingCost: 0,
      total: 40000,
      status: 'PENDING',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      deliveryAddress: {
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '9876543210',
      },
      contactInfo: {
        email: 'john@example.com',
        phone: '9876543210',
      },
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    vi.mocked(checkoutService.submitOrder).mockResolvedValue(mockOrder);

    renderCheckoutPage();

    // Fill in the form (step 1)
    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Address Line 1/), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/City/), { target: { value: 'Mumbai' } });
    fireEvent.change(screen.getByLabelText(/State/), { target: { value: 'Maharashtra' } });
    fireEvent.change(screen.getByLabelText(/Pincode/), { target: { value: '400001' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contact Phone/), { target: { value: '9876543210' } });

    // Navigate to step 3 and place order
    goToStep3();
    const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
      expect(screen.getByText('A1F-20240115-0001')).toBeInTheDocument();
      expect(screen.getByText(/Thank you for your order/)).toBeInTheDocument();
    });
  });

  it('should calculate and display shipping cost based on city', async () => {
    vi.mocked(checkoutService.calculateShipping).mockReturnValue(500);

    renderCheckoutPage();

    const cityInput = screen.getByLabelText(/City/);
    fireEvent.change(cityInput, { target: { value: 'Delhi' } });

    await waitFor(() => {
      expect(screen.getByText('₹500')).toBeInTheDocument();
    });
  });

  it('should show free shipping for Mumbai', async () => {
    vi.mocked(checkoutService.calculateShipping).mockReturnValue(0);

    renderCheckoutPage();

    const cityInput = screen.getByLabelText(/City/);
    fireEvent.change(cityInput, { target: { value: 'Mumbai' } });

    await waitFor(() => {
      expect(screen.getByText('FREE')).toBeInTheDocument();
      expect(screen.getByText(/Free delivery in Mumbai/)).toBeInTheDocument();
    });
  });

  it('should prefill user data for authenticated users', () => {
    const mockUser = {
      id: 'user1',
      email: 'user@example.com',
      passwordHash: 'hash',
      name: 'Test User',
      phone: '9876543210',
      addresses: [],
      wishlist: [],
      orders: [],
      createdAt: new Date(),
    };

    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockReturnValue(mockUser);

    renderCheckoutPage();

    const emailInput = screen.getByLabelText(/Email Address/) as HTMLInputElement;
    const nameInput = screen.getByLabelText(/Full Name/) as HTMLInputElement;

    expect(emailInput.value).toBe('user@example.com');
    expect(nameInput.value).toBe('Test User');
  });

  it('should redirect to cart if cart is empty', () => {
    vi.mocked(cartService.getCart).mockReturnValue({
      ...mockCart,
      items: [],
    });

    renderCheckoutPage();

    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });

  it('should display order confirmation with delivery address', async () => {
    const mockOrder: Order = {
      id: 'order1',
      orderId: 'A1F-20240115-0001',
      items: [],
      subtotal: 40000,
      shippingCost: 0,
      total: 40000,
      status: 'PENDING',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      deliveryAddress: {
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '9876543210',
      },
      contactInfo: {
        email: 'john@example.com',
        phone: '9876543210',
      },
      orderDate: new Date(),
    };

    vi.mocked(checkoutService.submitOrder).mockResolvedValue(mockOrder);

    renderCheckoutPage();

    // Fill and submit form (step 1)
    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Address Line 1/), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/City/), { target: { value: 'Mumbai' } });
    fireEvent.change(screen.getByLabelText(/State/), { target: { value: 'Maharashtra' } });
    fireEvent.change(screen.getByLabelText(/Pincode/), { target: { value: '400001' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contact Phone/), { target: { value: '9876543210' } });

    // Navigate to step 3 and place order
    goToStep3();
    fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));

    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
      expect(screen.getByText(/Mumbai/)).toBeInTheDocument();
      expect(screen.getByText(/Maharashtra/)).toBeInTheDocument();
      expect(screen.getByText(/400001/)).toBeInTheDocument();
    });
  });

  describe('Buy Now checkout', () => {
    const buyNowProduct = {
      productId: 'prod2',
      product: {
        id: 'prod2',
        name: 'Premium Dining Table',
        slug: 'premium-dining-table',
        description: 'Elegant dining table',
        shortDescription: 'Dining table',
        price: 35000,
        discountPrice: 30000,
        discountPercentage: 14,
        category: 'Dining',
        imageUrl: '/images/table.jpg',
        rating: 4.8,
        ratingCount: 15,
        inStock: true,
        sku: 'DIN001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quantity: 1,
      priceAtAdd: 30000,
      itemTotal: 30000,
    };

    it('should display Buy Now product in order summary', () => {
      mockLocation.state = { buyNowProduct };

      renderCheckoutPage();

      expect(screen.getByText('Premium Dining Table')).toBeInTheDocument();
      expect(screen.getByText('Qty: 1')).toBeInTheDocument();
      // Use getAllByText since price appears multiple times
      const priceElements = screen.getAllByText(/₹30,000/);
      expect(priceElements.length).toBeGreaterThan(0);
    });

    it('should not call cartService.getCart for Buy Now checkout', () => {
      mockLocation.state = { buyNowProduct };

      renderCheckoutPage();

      // Cart service should not be called since we're using Buy Now
      expect(cartService.getCart).not.toHaveBeenCalled();
    });

    it('should submit Buy Now order without clearing cart', async () => {
      mockLocation.state = { buyNowProduct };

      const mockOrder: Order = {
        id: 'order2',
        orderId: 'A1F-20240115-0002',
        items: [
          {
            productId: 'prod2',
            productName: 'Premium Dining Table',
            quantity: 1,
            price: 30000,
            itemTotal: 30000,
          },
        ],
        subtotal: 30000,
        shippingCost: 0,
        total: 30000,
        status: 'PENDING',
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        deliveryAddress: {
          fullName: 'Jane Smith',
          addressLine1: '456 Oak Ave',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002',
          phone: '9876543211',
        },
        contactInfo: {
          email: 'jane@example.com',
          phone: '9876543211',
        },
        orderDate: new Date(),
      };

      vi.mocked(checkoutService.submitOrder).mockResolvedValue(mockOrder);

      renderCheckoutPage();

      // Fill in the form (step 1)
      fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'Jane Smith' } });
      fireEvent.change(screen.getByLabelText(/Address Line 1/), { target: { value: '456 Oak Ave' } });
      fireEvent.change(screen.getByLabelText(/City/), { target: { value: 'Mumbai' } });
      fireEvent.change(screen.getByLabelText(/State/), { target: { value: 'Maharashtra' } });
      fireEvent.change(screen.getByLabelText(/Pincode/), { target: { value: '400002' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: '9876543211' } });
      fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'jane@example.com' } });
      fireEvent.change(screen.getByLabelText(/Contact Phone/), { target: { value: '9876543211' } });

      // Navigate to step 3 and place order
      goToStep3();
      const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
      fireEvent.click(placeOrderButton);

      await waitFor(() => {
        expect(checkoutService.submitOrder).toHaveBeenCalledWith(
          expect.objectContaining({
            items: [buyNowProduct],
          }),
          false // clearCart should be false for Buy Now
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
      });
    });

    it('should pass clearCart=true for regular cart checkout', async () => {
      // Regular cart checkout (no Buy Now product in state)
      mockLocation.state = null;

      const mockOrder: Order = {
        id: 'order3',
        orderId: 'A1F-20240115-0003',
        items: [],
        subtotal: 40000,
        shippingCost: 0,
        total: 40000,
        status: 'PENDING',
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        deliveryAddress: {
          fullName: 'John Doe',
          addressLine1: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '9876543210',
        },
        contactInfo: {
          email: 'john@example.com',
          phone: '9876543210',
        },
        orderDate: new Date(),
      };

      vi.mocked(checkoutService.submitOrder).mockResolvedValue(mockOrder);

      renderCheckoutPage();

      // Fill in the form (step 1)
      fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Address Line 1/), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText(/City/), { target: { value: 'Mumbai' } });
      fireEvent.change(screen.getByLabelText(/State/), { target: { value: 'Maharashtra' } });
      fireEvent.change(screen.getByLabelText(/Pincode/), { target: { value: '400001' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Contact Phone/), { target: { value: '9876543210' } });

      // Navigate to step 3 and place order
      goToStep3();
      const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
      fireEvent.click(placeOrderButton);

      await waitFor(() => {
        expect(checkoutService.submitOrder).toHaveBeenCalledWith(
          expect.any(Object),
          true // clearCart should be true for regular checkout
        );
      });
    });
  });
});
