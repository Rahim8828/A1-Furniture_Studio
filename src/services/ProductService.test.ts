import { describe, it, expect } from 'vitest';
import { ProductService } from './ProductService';

describe('ProductService', () => {
  const service = new ProductService();

  describe('getProductById', () => {
    it('should return a product when valid ID is provided', async () => {
      const product = await service.getProductById('prod-1');
      
      expect(product).toBeDefined();
      expect(product?.id).toBe('prod-1');
      expect(product?.name).toBe('Premium L-Shape Sofa');
      expect(product?.images).toBeDefined();
      expect(product?.materials).toBeDefined();
      expect(product?.dimensions).toBeDefined();
    });

    it('should return null when invalid ID is provided', async () => {
      const product = await service.getProductById('invalid-id');
      expect(product).toBeNull();
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products for valid category', async () => {
      const products = await service.getProductsByCategory('Sofa Sets');
      
      expect(products.length).toBeGreaterThan(0);
      expect(products.every(p => p.category === 'Sofa Sets')).toBe(true);
    });

    it('should be case-insensitive', async () => {
      const products = await service.getProductsByCategory('sofa sets');
      expect(products.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent category', async () => {
      const products = await service.getProductsByCategory('Non-Existent Category');
      expect(products).toEqual([]);
    });
  });

  describe('getFeaturedProducts', () => {
    it('should return featured products', async () => {
      const products = await service.getFeaturedProducts(8);
      
      expect(products.length).toBeLessThanOrEqual(8);
      expect(products.every(p => p.inStock)).toBe(true);
    });

    it('should respect the limit parameter', async () => {
      const products = await service.getFeaturedProducts(5);
      expect(products.length).toBeLessThanOrEqual(5);
    });
  });

  describe('searchProducts', () => {
    it('should return products matching search query', async () => {
      const products = await service.searchProducts('sofa');
      
      expect(products.length).toBeGreaterThan(0);
      expect(products.some(p => 
        p.name.toLowerCase().includes('sofa') || 
        p.description.toLowerCase().includes('sofa')
      )).toBe(true);
    });

    it('should search across name, description, and category', async () => {
      const products = await service.searchProducts('wooden');
      expect(products.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty query', async () => {
      const products = await service.searchProducts('');
      expect(products).toEqual([]);
    });

    it('should be case-insensitive', async () => {
      const products = await service.searchProducts('SOFA');
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('getAllCategories', () => {
    it('should return all 8 categories', async () => {
      const categories = await service.getAllCategories();
      
      expect(categories.length).toBe(8);
      expect(categories.every(c => c.id && c.name && c.slug)).toBe(true);
    });

    it('should include required category names', async () => {
      const categories = await service.getAllCategories();
      const categoryNames = categories.map(c => c.name);
      
      expect(categoryNames).toContain('Sofa Sets');
      expect(categoryNames).toContain('Beds & Mattresses');
      expect(categoryNames).toContain('Dining Tables');
      expect(categoryNames).toContain('Wardrobes & Storage');
      expect(categoryNames).toContain('Office Furniture');
      expect(categoryNames).toContain('Custom Furniture');
      expect(categoryNames).toContain('Sofa & Chair Repair');
      expect(categoryNames).toContain('Furniture Polish Services');
    });
  });
});
