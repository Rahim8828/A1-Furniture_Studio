import type { Category } from '../models/types';

/**
 * Mock category data for A1 Furniture Studio
 * 8 main categories as per requirements
 */
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Sofa Sets',
    slug: 'sofa-sets',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    productCount: 5
  },
  {
    id: 'cat-2',
    name: 'Beds & Mattresses',
    slug: 'beds-mattresses',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
    productCount: 4
  },
  {
    id: 'cat-3',
    name: 'Dining Tables',
    slug: 'dining-tables',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop',
    productCount: 3
  },
  {
    id: 'cat-4',
    name: 'Wardrobes & Storage',
    slug: 'wardrobes-storage',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
    productCount: 3
  },
  {
    id: 'cat-5',
    name: 'Office Furniture',
    slug: 'office-furniture',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop',
    productCount: 3
  },
  {
    id: 'cat-6',
    name: 'Custom Furniture',
    slug: 'custom-furniture',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop',
    productCount: 2
  },
  {
    id: 'cat-7',
    name: 'Sofa & Chair Repair',
    slug: 'sofa-chair-repair',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    productCount: 1
  },
  {
    id: 'cat-8',
    name: 'Furniture Polish Services',
    slug: 'furniture-polish-services',
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop',
    productCount: 1
  }
];
