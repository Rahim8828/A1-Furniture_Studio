import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import type { Product } from '../models/types';

describe('ProductCard Component', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Modern Sofa',
    slug: 'modern-sofa',
    description: 'A comfortable modern sofa',
    shortDescription: 'Comfortable sofa',
    price: 50000,
    category: 'sofa-sets',
    imageUrl: 'https://example.com/sofa.jpg',
    rating: 4.5,
    ratingCount: 10,
    inStock: true,
    sku: 'SOF-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const defaultProps = {
    product: mockProduct,
    onAddToCart: vi.fn(),
    onAddToWishlist: vi.fn(),
    onProductClick: vi.fn(),
  };

  it('renders product name', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('Modern Sofa')).toBeInTheDocument();
  });

  it('renders product image with lazy loading', () => {
    render(<ProductCard {...defaultProps} />);
    const image = screen.getByAltText('Modern Sofa');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Modern Sofa');
  });

  it('renders product price', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText(/₹50,000/)).toBeInTheDocument();
  });

  it('renders Add to Cart button', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('renders wishlist button', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByLabelText('Add to wishlist')).toBeInTheDocument();
  });

  it('displays discount when product has discount', () => {
    const discountedProduct = {
      ...mockProduct,
      discountPrice: 40000,
      discountPercentage: 20,
    };
    render(<ProductCard {...defaultProps} product={discountedProduct} />);

    // Should display discount badge
    expect(screen.getByText('20% OFF')).toBeInTheDocument();

    // Should display discounted price
    expect(screen.getByText(/₹40,000/)).toBeInTheDocument();

    // Should display original price with strikethrough
    expect(screen.getByText(/₹50,000/)).toBeInTheDocument();

    // Should display savings amount
    expect(screen.getByText(/Save ₹10,000/)).toBeInTheDocument();
  });

  it('does not display discount badge when product has no discount', () => {
    render(<ProductCard {...defaultProps} />);

    // Should not display discount badge
    expect(screen.queryByText(/OFF/)).not.toBeInTheDocument();

    // Should only display regular price
    expect(screen.getByText(/₹50,000/)).toBeInTheDocument();
  });

  it('displays rating when product has ratings', () => {
    render(<ProductCard {...defaultProps} />);
    // New compact rating badge shows "4.5" and "(10)"
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('displays "No ratings yet" when product has no ratings', () => {
    const productWithoutRatings = {
      ...mockProduct,
      rating: 0,
      ratingCount: 0,
    };
    render(<ProductCard {...defaultProps} product={productWithoutRatings} />);
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
  });

  it('calls onAddToCart when Add to Cart button is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(defaultProps.onAddToCart).toHaveBeenCalledWith('1');
  });

  it('calls onAddToWishlist when wishlist button is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Add to wishlist'));
    expect(defaultProps.onAddToWishlist).toHaveBeenCalledWith('1');
  });

  it('calls onProductClick when card is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Modern Sofa'));
    expect(defaultProps.onProductClick).toHaveBeenCalledWith('1');
  });

  it('disables Add to Cart button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    render(<ProductCard {...defaultProps} product={outOfStockProduct} />);
    const button = screen.getByText('Add to Cart');
    expect(button).toBeDisabled();
  });

  it('shows EMI information', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText(/EMI from/)).toBeInTheDocument();
  });
});
