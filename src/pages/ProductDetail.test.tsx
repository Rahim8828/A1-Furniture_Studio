import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { productService } from '../services/ProductService';
import { cartService } from '../services/CartService';
import type { ProductDetail as ProductDetailType } from '../models/types';

// Mock the services
vi.mock('../services/ProductService');
vi.mock('../services/CartService');
vi.mock('../services/WishlistService');

// Mock navigate function
const mockNavigate = vi.fn();

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ productId: 'prod-1' }),
    useNavigate: () => mockNavigate,
  };
});

const mockProduct: ProductDetailType = {
  id: 'prod-1',
  name: 'Premium L-Shape Sofa',
  slug: 'premium-l-shape-sofa',
  description: 'Luxurious L-shaped sofa with premium fabric upholstery and solid wood frame.',
  shortDescription: 'Luxurious L-shaped sofa',
  price: 45000,
  discountPrice: 38000,
  discountPercentage: 15,
  category: 'Sofa Sets',
  subcategory: 'L-Shape Sofas',
  imageUrl: 'https://example.com/sofa.jpg',
  rating: 4.5,
  ratingCount: 28,
  inStock: true,
  sku: 'SOF-LS-001',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-02-01'),
  images: [
    {
      url: 'https://example.com/sofa1.jpg',
      alt: 'Premium L-Shape Sofa',
      isPrimary: true,
      order: 1,
    },
    {
      url: 'https://example.com/sofa2.jpg',
      alt: 'Premium L-Shape Sofa - View 2',
      isPrimary: false,
      order: 2,
    },
  ],
  materials: {
    woodType: 'Teak Wood',
    fabric: 'Premium Fabric',
    polish: 'Natural Wood Finish',
  },
  dimensions: {
    length: 220,
    width: 90,
    height: 85,
    unit: 'cm',
  },
  specifications: {
    'Seating Capacity': '3-5 persons',
    'Frame Material': 'Solid Wood',
    'Cushion Type': 'High-Density Foam',
  },
  deliveryInfo: 'Free delivery within Mumbai. Delivery in 7-14 business days.',
  warrantyInfo: '2 years manufacturing warranty.',
};

describe('ProductDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('should display product name', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Name appears in breadcrumb and h1, so use getAllByText
      const nameElements = screen.getAllByText('Premium L-Shape Sofa');
      expect(nameElements.length).toBeGreaterThan(0);
    });
  });

  it('should display product description', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Luxurious L-shaped sofa with premium fabric/)
      ).toBeInTheDocument();
    });
  });

  it('should display price with discount', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('₹38,000')).toBeInTheDocument();
      expect(screen.getByText('₹45,000')).toBeInTheDocument();
      // "15% OFF" appears on image badge and price section, use getAllByText
      const offElements = screen.getAllByText(/15% OFF/);
      expect(offElements.length).toBeGreaterThan(0);
    });
  });

  it('should display materials information', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Materials appear in quick-highlight cards; use getAllByText because
      // the Description tab also duplicates them.
      expect(screen.getAllByText(/Teak Wood/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Premium Fabric/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Natural Wood Finish/).length).toBeGreaterThan(0);
    });
  });

  it('should display dimensions', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/220 × 90 × 85 cm/)).toBeInTheDocument();
    });
  });

  it('should display specifications in Specifications tab', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    // Wait for product to load, then switch to Specifications tab
    await waitFor(() => {
      expect(screen.getByText('Specifications')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Specifications'));

    await waitFor(() => {
      expect(screen.getByText(/3-5 persons/)).toBeInTheDocument();
      expect(screen.getByText(/Solid Wood/)).toBeInTheDocument();
      expect(screen.getByText(/High-Density Foam/)).toBeInTheDocument();
    });
  });

  it('should display delivery information in Delivery tab', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    // Wait for product to load, then switch to Delivery & Warranty tab
    await waitFor(() => {
      expect(screen.getByText('Delivery & Warranty')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Delivery & Warranty'));

    await waitFor(() => {
      expect(
        screen.getByText(/Free delivery within Mumbai/)
      ).toBeInTheDocument();
    });
  });

  it('should display warranty information in Delivery tab', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    // Wait for product to load, then switch to Delivery & Warranty tab
    await waitFor(() => {
      expect(screen.getByText('Delivery & Warranty')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Delivery & Warranty'));

    await waitFor(() => {
      expect(screen.getByText(/2 years manufacturing warranty/)).toBeInTheDocument();
    });
  });

  it('should display Add to Cart and Buy Now buttons', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });
  });

  it('should display ratings when available', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('(28 ratings)')).toBeInTheDocument();
    });
  });

  it('should display "No ratings yet" when product has no ratings', async () => {
    const productWithoutRatings = {
      ...mockProduct,
      rating: 0,
      ratingCount: 0,
    };
    vi.mocked(productService.getProductById).mockResolvedValue(productWithoutRatings);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No ratings yet')).toBeInTheDocument();
    });
  });

  it('should display image gallery', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it('should display loading skeleton initially', () => {
    vi.mocked(productService.getProductById).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    // Skeleton loading should be present
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  describe('Buy Now functionality', () => {
    it('should navigate to checkout with product when Buy Now is clicked', async () => {
      vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

      render(
        <BrowserRouter>
          <ProductDetail />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Buy Now')).toBeInTheDocument();
      });

      const buyNowButton = screen.getByText('Buy Now');
      fireEvent.click(buyNowButton);

      expect(mockNavigate).toHaveBeenCalledWith('/checkout', {
        state: {
          buyNowProduct: {
            productId: 'prod-1',
            product: mockProduct,
            quantity: 1,
            priceAtAdd: 38000, // discounted price
            itemTotal: 38000,
          },
        },
      });
    });

    it('should not add product to cart when Buy Now is clicked', async () => {
      vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);
      const addItemSpy = vi.spyOn(cartService, 'addItem');

      render(
        <BrowserRouter>
          <ProductDetail />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Buy Now')).toBeInTheDocument();
      });

      const buyNowButton = screen.getByText('Buy Now');
      fireEvent.click(buyNowButton);

      // Verify cart was NOT modified
      expect(addItemSpy).not.toHaveBeenCalled();
    });

    it('should use regular price when no discount is available', async () => {
      const productWithoutDiscount = {
        ...mockProduct,
        discountPrice: undefined,
        discountPercentage: undefined,
      };
      vi.mocked(productService.getProductById).mockResolvedValue(productWithoutDiscount);

      render(
        <BrowserRouter>
          <ProductDetail />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Buy Now')).toBeInTheDocument();
      });

      const buyNowButton = screen.getByText('Buy Now');
      fireEvent.click(buyNowButton);

      expect(mockNavigate).toHaveBeenCalledWith('/checkout', {
        state: {
          buyNowProduct: {
            productId: 'prod-1',
            product: productWithoutDiscount,
            quantity: 1,
            priceAtAdd: 45000, // regular price
            itemTotal: 45000,
          },
        },
      });
    });
  });
});
