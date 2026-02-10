import { describe, it, expect, beforeEach } from 'vitest';
import { SEOService } from './SEOService';
import type { ProductDetail, Category } from '../models/types';

describe('SEOService', () => {
  let seoService: SEOService;

  beforeEach(() => {
    seoService = new SEOService('https://a1furniturestudio.com');
  });

  describe('generateProductSchema', () => {
    it('should generate valid JSON-LD schema for a product', () => {
      const product: ProductDetail = {
        id: '1',
        name: 'Premium Leather Sofa',
        slug: 'premium-leather-sofa',
        description: 'Luxurious leather sofa with premium finish',
        shortDescription: 'Premium leather sofa',
        price: 50000,
        discountPrice: 45000,
        discountPercentage: 10,
        category: 'Sofa Sets',
        imageUrl: 'https://example.com/sofa.jpg',
        rating: 4.5,
        ratingCount: 20,
        inStock: true,
        sku: 'SOFA-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        materials: { woodType: 'Teak', fabric: 'Leather' },
        dimensions: { length: 200, width: 90, height: 85, unit: 'cm' },
        specifications: {},
        deliveryInfo: 'Free delivery',
        warrantyInfo: '1 year warranty'
      };

      const schema = seoService.generateProductSchema(product);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Premium Leather Sofa');
      expect(schema.sku).toBe('SOFA-001');
      expect(schema.offers.price).toBe(45000);
      expect(schema.offers.priceCurrency).toBe('INR');
      expect(schema.offers.availability).toBe('https://schema.org/InStock');
    });

    it('should include ratings in schema when available', () => {
      const product: ProductDetail = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        shortDescription: 'Test',
        price: 10000,
        category: 'Test',
        imageUrl: 'test.jpg',
        rating: 4.8,
        ratingCount: 50,
        inStock: true,
        sku: 'TEST-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        materials: {},
        dimensions: { length: 100, width: 50, height: 75, unit: 'cm' },
        specifications: {},
        deliveryInfo: 'Free',
        warrantyInfo: '1 year'
      };

      const schema = seoService.generateProductSchema(product);

      expect(schema.aggregateRating).toBeDefined();
      expect(schema.aggregateRating.ratingValue).toBe(4.8);
      expect(schema.aggregateRating.reviewCount).toBe(50);
    });

    it('should not include ratings when ratingCount is 0', () => {
      const product: ProductDetail = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        shortDescription: 'Test',
        price: 10000,
        category: 'Test',
        imageUrl: 'test.jpg',
        rating: 0,
        ratingCount: 0,
        inStock: true,
        sku: 'TEST-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        materials: {},
        dimensions: { length: 100, width: 50, height: 75, unit: 'cm' },
        specifications: {},
        deliveryInfo: 'Free',
        warrantyInfo: '1 year'
      };

      const schema = seoService.generateProductSchema(product);

      expect(schema.aggregateRating).toBeUndefined();
    });

    it('should mark out of stock products correctly', () => {
      const product: ProductDetail = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        shortDescription: 'Test',
        price: 10000,
        category: 'Test',
        imageUrl: 'test.jpg',
        rating: 0,
        ratingCount: 0,
        inStock: false,
        sku: 'TEST-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        materials: {},
        dimensions: { length: 100, width: 50, height: 75, unit: 'cm' },
        specifications: {},
        deliveryInfo: 'Free',
        warrantyInfo: '1 year'
      };

      const schema = seoService.generateProductSchema(product);

      expect(schema.offers.availability).toBe('https://schema.org/OutOfStock');
    });
  });

  describe('generatePageMeta', () => {
    it('should generate meta tags for homepage', () => {
      const meta = seoService.generatePageMeta('HOME');

      expect(meta.title).toContain('A1 Furniture Studio');
      expect(meta.description).toBeTruthy();
      expect(meta.keywords.length).toBeGreaterThan(0);
      expect(meta.canonicalUrl).toBe('https://a1furniturestudio.com');
    });

    it('should generate meta tags for product page', () => {
      const product: ProductDetail = {
        id: '1',
        name: 'Luxury Sofa',
        slug: 'luxury-sofa',
        description: 'A luxurious sofa',
        shortDescription: 'Luxury sofa',
        price: 50000,
        category: 'Sofas',
        imageUrl: 'sofa.jpg',
        rating: 4.5,
        ratingCount: 10,
        inStock: true,
        sku: 'SOFA-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        materials: {},
        dimensions: { length: 200, width: 90, height: 85, unit: 'cm' },
        specifications: {},
        deliveryInfo: 'Free',
        warrantyInfo: '1 year'
      };

      const meta = seoService.generatePageMeta('PRODUCT', product);

      expect(meta.title).toContain('Luxury Sofa');
      expect(meta.title).toContain('₹50,000');
      expect(meta.canonicalUrl).toBe('https://a1furniturestudio.com/products/luxury-sofa');
      expect(meta.ogImage).toBe('sofa.jpg');
    });

    it('should generate meta tags for category page', () => {
      const category: Category = {
        id: '1',
        name: 'Sofa Sets',
        slug: 'sofa-sets',
        imageUrl: 'category.jpg',
        productCount: 15
      };

      const meta = seoService.generatePageMeta('CATEGORY', category);

      expect(meta.title).toContain('Sofa Sets');
      expect(meta.description).toContain('sofa sets');
      expect(meta.canonicalUrl).toBe('https://a1furniturestudio.com/category/sofa-sets');
    });

    it('should generate meta tags for about page', () => {
      const meta = seoService.generatePageMeta('ABOUT');

      expect(meta.title).toContain('About Us');
      expect(meta.canonicalUrl).toBe('https://a1furniturestudio.com/about');
    });

    it('should generate meta tags for contact page', () => {
      const meta = seoService.generatePageMeta('CONTACT');

      expect(meta.title).toContain('Contact');
      expect(meta.canonicalUrl).toBe('https://a1furniturestudio.com/contact');
    });

    it('should generate meta tags for search page', () => {
      const meta = seoService.generatePageMeta('SEARCH', 'leather sofa');

      expect(meta.title).toContain('leather sofa');
      expect(meta.description).toContain('leather sofa');
    });
  });

  describe('generateSitemap', () => {
    it('should generate sitemap with homepage', () => {
      const sitemap = seoService.generateSitemap();

      expect(sitemap.entries.length).toBeGreaterThan(0);
      const homepage = sitemap.entries.find(e => e.url === 'https://a1furniturestudio.com');
      expect(homepage).toBeDefined();
      expect(homepage?.priority).toBe(1.0);
    });

    it('should include static pages in sitemap', () => {
      const sitemap = seoService.generateSitemap();

      const aboutPage = sitemap.entries.find(e => e.url.includes('/about'));
      const contactPage = sitemap.entries.find(e => e.url.includes('/contact'));
      
      expect(aboutPage).toBeDefined();
      expect(contactPage).toBeDefined();
    });

    it('should include product pages when provided', () => {
      const products: ProductDetail[] = [{
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        shortDescription: 'Test',
        price: 10000,
        category: 'Test',
        imageUrl: 'test.jpg',
        rating: 0,
        ratingCount: 0,
        inStock: true,
        sku: 'TEST-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
        materials: {},
        dimensions: { length: 100, width: 50, height: 75, unit: 'cm' },
        specifications: {},
        deliveryInfo: 'Free',
        warrantyInfo: '1 year'
      }];

      const sitemap = seoService.generateSitemap(products);

      const productPage = sitemap.entries.find(e => e.url.includes('/products/test-product'));
      expect(productPage).toBeDefined();
    });

    it('should include category pages when provided', () => {
      const categories: Category[] = [{
        id: '1',
        name: 'Sofas',
        slug: 'sofas',
        imageUrl: 'sofas.jpg',
        productCount: 10
      }];

      const sitemap = seoService.generateSitemap(undefined, categories);

      const categoryPage = sitemap.entries.find(e => e.url.includes('/category/sofas'));
      expect(categoryPage).toBeDefined();
    });
  });

  describe('isSEOFriendlyUrl', () => {
    it('should return true for clean URLs without query params', () => {
      expect(seoService.isSEOFriendlyUrl('https://example.com/products/sofa')).toBe(true);
      expect(seoService.isSEOFriendlyUrl('https://example.com/category/beds')).toBe(true);
      expect(seoService.isSEOFriendlyUrl('https://example.com/')).toBe(true);
    });

    it('should return false for URLs with query parameters', () => {
      expect(seoService.isSEOFriendlyUrl('https://example.com/products?id=123')).toBe(false);
      expect(seoService.isSEOFriendlyUrl('https://example.com/search?q=sofa')).toBe(false);
    });

    it('should return false for URLs with session IDs', () => {
      expect(seoService.isSEOFriendlyUrl('https://example.com/products;jsessionid=ABC123')).toBe(false);
      expect(seoService.isSEOFriendlyUrl('https://example.com/page?sessionid=XYZ')).toBe(false);
      expect(seoService.isSEOFriendlyUrl('https://example.com/page?sid=123')).toBe(false);
    });
  });
});
