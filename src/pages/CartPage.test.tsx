import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartPage from './CartPage';
import { cartService } from '../services/CartService';
import type { Cart, CartItem, Product } from '../models/types';

// Mock the services
vi.mock('../services/CartService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CartPage', () => {
  const mockProduct1: Product = {
    id: 'prod-1',
    name: 'Modern L-Shape Sofa',
    slug: 'modern-l-shape-sofa',
    description: 'Comfortable L-shaped sofa',
    shortDescription: 'L-shaped sofa',
    price: 45000,
    discountPrice: 40000,
    discountPercentage: 11,
    category: 'Sofa Sets',
    imageUrl: 'https://example.com/sofa1.jpg',
    rating: 4.5,
    ratingCount: 10,
    inStock: true,
    sku: 'SOF-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct2: Product = {
    id: 'prod-2',
    name: 'King Size Bed',
    slug: 'king-size-bed',
    description: 'Luxury king size bed',
    shortDescription: 'King bed',
    price: 55000,
    category: 'Beds & Mattresses',
    imageUrl: 'https://example.com/bed1.jpg',
    rating: 4.8,
    ratingCount: 15,
    inStock: true,
    sku: 'BED-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCartItem1: CartItem = {
    productId: 'prod-1',
    product: mockProduct1,
    quantity: 2,
    priceAtAdd: 40000,
    itemTotal: 80000,
  };

  const mockCartItem2: CartItem = {
    productId: 'prod-2',
    product: mockProduct2,
    quantity: 1,
    priceAtAdd: 55000,
    itemTotal: 55000,
  };

  const mockCart: Cart = {
    id: 'cart-1',
    sessionId: 'session-1',
    items: [mockCartItem1, mockCartItem2],
    subtotal: 135000,
    total: 135000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const emptyCart: Cart = {
    id: 'cart-2',
    sessionId: 'session-2',
    items: [],
    subtotal: 0,
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays all cart items with images, names, prices, and quantities', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern L-Shape Sofa')).toBeInTheDocument();
      expect(screen.getByText('King Size Bed')).toBeInTheDocument();
    });

    // Check images are present
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);

    // Check prices are displayed (text may be split across elements)
    expect(screen.getByText((_content, element) => {
      return element?.textContent === '₹40,000';
    })).toBeInTheDocument();
    expect(screen.getAllByText((_content, element) => {
      return element?.textContent === '₹55,000';
    }).length).toBeGreaterThan(0);

    // Check quantities are displayed
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    // Check categories are displayed
    expect(screen.getByText('Sofa Sets')).toBeInTheDocument();
    expect(screen.getByText('Beds & Mattresses')).toBeInTheDocument();
  });

  it('displays quantity update controls and remove buttons', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern L-Shape Sofa')).toBeInTheDocument();
    });

    // Check for quantity controls (+ and - buttons)
    const decreaseButtons = screen.getAllByLabelText('Decrease quantity');
    const increaseButtons = screen.getAllByLabelText('Increase quantity');
    expect(decreaseButtons.length).toBe(2);
    expect(increaseButtons.length).toBe(2);

    // Check for remove buttons
    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons.length).toBe(2);
  });

  it('shows subtotal and total', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
    });

    // Check subtotal is displayed
    expect(screen.getByText('Subtotal (3 items)')).toBeInTheDocument();
    const totalElements = screen.getAllByText((_content, element) => {
      return element?.textContent === '₹135,000';
    });
    expect(totalElements.length).toBeGreaterThanOrEqual(1);

    // Check total is displayed
    const totalLabels = screen.getAllByText('Total');
    expect(totalLabels.length).toBeGreaterThan(0);
  });

  it('displays "Proceed to Checkout" button', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText('Proceed to Checkout');
    expect(checkoutButton).toBeInTheDocument();
  });

  it('handles empty cart state', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(emptyCart);

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });

    expect(
      screen.getByText("Looks like you haven't added any items to your cart yet. Start shopping to fill it up!")
    ).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('calls cartService.updateQuantity when quantity is changed', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);
    vi.mocked(cartService.updateQuantity).mockImplementation(() => {});

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern L-Shape Sofa')).toBeInTheDocument();
    });

    const increaseButtons = screen.getAllByLabelText('Increase quantity');
    fireEvent.click(increaseButtons[0]);

    expect(cartService.updateQuantity).toHaveBeenCalledWith('prod-1', 3);
  });

  it('calls cartService.removeItem when remove button is clicked', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);
    vi.mocked(cartService.removeItem).mockImplementation(() => {});

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern L-Shape Sofa')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(cartService.removeItem).toHaveBeenCalledWith('prod-1');
  });

  it('navigates to checkout when "Proceed to Checkout" is clicked', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText('Proceed to Checkout');
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('displays discount information for discounted products', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern L-Shape Sofa')).toBeInTheDocument();
    });

    // Check for original price (struck through)
    expect(screen.getByText('₹45,000')).toBeInTheDocument();

    // Check for discount badge
    expect(screen.getByText('11% OFF')).toBeInTheDocument();
  });

  it('displays item totals correctly', async () => {
    vi.mocked(cartService.getCart).mockReturnValue(mockCart);

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern L-Shape Sofa')).toBeInTheDocument();
    });

    // Check item totals (text may be split across elements)
    expect(screen.getByText((_content, element) => {
      return element?.textContent === '₹80,000';
    })).toBeInTheDocument(); // 2 x 40,000
    expect(screen.getAllByText((_content, element) => {
      return element?.textContent === '₹55,000';
    }).length).toBeGreaterThan(0); // 1 x 55,000
  });
});
