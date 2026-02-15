import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from './SearchResults';
import { productService } from '../services/ProductService';
import type { Product } from '../models/types';

// Mock the services
vi.mock('../services/ProductService');
vi.mock('../services/CartService');
vi.mock('../services/WishlistService');

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Sofa',
    slug: 'modern-sofa',
    description: 'A comfortable modern sofa',
    shortDescription: 'Modern sofa',
    price: 25000,
    category: 'sofa-sets',
    imageUrl: '/sofa.jpg',
    rating: 4.5,
    ratingCount: 10,
    inStock: true,
    sku: 'SOF-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Leather Sofa',
    slug: 'leather-sofa',
    description: 'Premium leather sofa',
    shortDescription: 'Leather sofa',
    price: 35000,
    category: 'sofa-sets',
    imageUrl: '/leather-sofa.jpg',
    rating: 4.8,
    ratingCount: 15,
    inStock: true,
    sku: 'SOF-002',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('SearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays search query and result count', async () => {
    vi.mocked(productService.searchProducts).mockResolvedValue(mockProducts);

    render(
      <MemoryRouter initialEntries={['/search?q=sofa']}>
        <SearchResults />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Results for "sofa"')).toBeInTheDocument();
      expect(screen.getByText('2 products found')).toBeInTheDocument();
    });
  });

  it('shows matching products using ProductCard grid', async () => {
    vi.mocked(productService.searchProducts).mockResolvedValue(mockProducts);

    render(
      <MemoryRouter initialEntries={['/search?q=sofa']}>
        <SearchResults />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Sofa')).toBeInTheDocument();
      expect(screen.getByText('Leather Sofa')).toBeInTheDocument();
    });
  });

  it('handles empty results with suggestions', async () => {
    vi.mocked(productService.searchProducts).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/search?q=nonexistent']}>
        <SearchResults />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No Results Found')).toBeInTheDocument();
      expect(screen.getByText(/We couldn't find any products matching "nonexistent"/)).toBeInTheDocument();
    });

    // Suggestions are in the suggestions box
    expect(screen.getByText(/Check your spelling/)).toBeInTheDocument();
    expect(screen.getByText(/Try more general keywords/)).toBeInTheDocument();
    expect(screen.getByText(/Browse our popular categories/)).toBeInTheDocument();
  });

  it('displays correct singular result count', async () => {
    vi.mocked(productService.searchProducts).mockResolvedValue([mockProducts[0]]);

    render(
      <MemoryRouter initialEntries={['/search?q=modern']}>
        <SearchResults />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1 product found')).toBeInTheDocument();
    });
  });

  it('handles missing query parameter', async () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <SearchResults />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Search Products')).toBeInTheDocument();
      expect(screen.getByText('Enter a search term to find furniture, décor, and more.')).toBeInTheDocument();
    });
  });
});
