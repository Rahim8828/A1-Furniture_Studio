import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WishlistPage from './WishlistPage';
import { wishlistService } from '../services/WishlistService';
import type { Product } from '../models/types';

// Mock the services
vi.mock('../services/WishlistService', () => ({
  wishlistService: {
    getWishlist: vi.fn(),
    removeItem: vi.fn(),
    moveToCart: vi.fn(),
    toggleItem: vi.fn(),
  },
}));

vi.mock('../services/CartService', () => ({
  cartService: {
    addItem: vi.fn(),
  },
}));

const mockProduct: Product = {
  id: 'prod1',
  name: 'Modern Sofa',
  slug: 'modern-sofa',
  description: 'A comfortable modern sofa',
  shortDescription: 'Modern sofa',
  price: 45000,
  discountPrice: 40000,
  discountPercentage: 11,
  category: 'Sofa Sets',
  imageUrl: 'https://example.com/sofa.jpg',
  rating: 4.5,
  ratingCount: 120,
  inStock: true,
  sku: 'SOF-001',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('WishlistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(wishlistService.getWishlist).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <WishlistPage />
      </BrowserRouter>
    );

    // Loading spinner is shown (has animate-spin class)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays empty wishlist message when wishlist is empty', async () => {
    vi.mocked(wishlistService.getWishlist).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <WishlistPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Your Wishlist is Empty')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Save your favorite furniture items here for easy access later/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('displays all wishlist items', async () => {
    const mockProducts: Product[] = [
      mockProduct,
      {
        ...mockProduct,
        id: 'prod2',
        name: 'Dining Table',
        category: 'Dining Tables',
      },
    ];

    vi.mocked(wishlistService.getWishlist).mockResolvedValue(mockProducts);

    render(
      <BrowserRouter>
        <WishlistPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('My Wishlist')).toBeInTheDocument();
    });

    expect(screen.getByText('2 items saved')).toBeInTheDocument();
    expect(screen.getByText('Modern Sofa')).toBeInTheDocument();
    expect(screen.getByText('Dining Table')).toBeInTheDocument();
  });

  it('displays singular item count for one item', async () => {
    vi.mocked(wishlistService.getWishlist).mockResolvedValue([mockProduct]);

    render(
      <BrowserRouter>
        <WishlistPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1 item saved')).toBeInTheDocument();
    });
  });

  it('displays Move to Cart and Remove buttons for each item', async () => {
    vi.mocked(wishlistService.getWishlist).mockResolvedValue([mockProduct]);

    render(
      <BrowserRouter>
        <WishlistPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Move to Cart')).toBeInTheDocument();
    });

    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
});
