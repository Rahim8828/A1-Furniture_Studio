import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryPage from './CategoryPage';
import { productService } from '../services/ProductService';
import type { Product, Category } from '../models/types';

// Mock the services
vi.mock('../services/ProductService');
vi.mock('../services/CartService');
vi.mock('../services/WishlistService');

// Mock useParams
const mockNavigate = vi.fn();
const mockParams = { categorySlug: 'sofa-sets' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockParams,
    useNavigate: () => mockNavigate,
  };
});

describe('CategoryPage', () => {
  const mockCategory: Category = {
    id: 'cat-1',
    name: 'Sofa Sets',
    slug: 'sofa-sets',
    imageUrl: 'https://example.com/sofa.jpg',
    productCount: 2,
  };

  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'Modern L-Shape Sofa',
      slug: 'modern-l-shape-sofa',
      description: 'Comfortable L-shaped sofa',
      shortDescription: 'L-shaped sofa',
      price: 45000,
      category: 'sofa-sets',
      imageUrl: 'https://example.com/sofa1.jpg',
      rating: 4.5,
      ratingCount: 10,
      inStock: true,
      sku: 'SOF-001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'prod-2',
      name: '3-Seater Fabric Sofa',
      slug: '3-seater-fabric-sofa',
      description: 'Elegant 3-seater sofa',
      shortDescription: '3-seater sofa',
      price: 35000,
      category: 'sofa-sets',
      imageUrl: 'https://example.com/sofa2.jpg',
      rating: 4.0,
      ratingCount: 5,
      inStock: true,
      sku: 'SOF-002',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockParams.categorySlug = 'sofa-sets';
  });

  it('displays category name as heading', async () => {
    vi.mocked(productService.getAllCategories).mockResolvedValue([mockCategory]);
    vi.mocked(productService.getProductsByCategory).mockResolvedValue(mockProducts);

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Category name appears in both breadcrumb and heading
      const elements = screen.getAllByText('Sofa Sets');
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    // Verify it's a heading element
    const heading = screen.getByRole('heading', { name: 'Sofa Sets' });
    expect(heading).toBeInTheDocument();
  });

  it('shows all products in the category using ProductCard grid', async () => {
    vi.mocked(productService.getAllCategories).mockResolvedValue([mockCategory]);
    vi.mocked(productService.getProductsByCategory).mockResolvedValue(mockProducts);

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern L-Shape Sofa')).toBeInTheDocument();
      expect(screen.getByText('3-Seater Fabric Sofa')).toBeInTheDocument();
    });

    // Verify filtered product count is displayed
    expect(screen.getByText(/2 of 2/)).toBeInTheDocument();
  });

  it('handles empty category state', async () => {
    vi.mocked(productService.getAllCategories).mockResolvedValue([mockCategory]);
    vi.mocked(productService.getProductsByCategory).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No Products Found')).toBeInTheDocument();
    });

    expect(screen.getByText('Browse Other Categories')).toBeInTheDocument();
  });

  it('displays loading skeleton initially', () => {
    vi.mocked(productService.getAllCategories).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    vi.mocked(productService.getProductsByCategory).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    // Skeleton loading cards should be present (animate-pulse elements)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('handles category not found', async () => {
    vi.mocked(productService.getAllCategories).mockResolvedValue([mockCategory]);
    vi.mocked(productService.getProductsByCategory).mockResolvedValue([]);
    mockParams.categorySlug = 'non-existent-category';

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Category Not Found')).toBeInTheDocument();
    });

    expect(
      screen.getByText("The category you're looking for doesn't exist or may have been removed.")
    ).toBeInTheDocument();
  });
});
