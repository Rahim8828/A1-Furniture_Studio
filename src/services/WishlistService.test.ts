import { describe, it, expect, beforeEach } from 'vitest';
import { WishlistService } from './WishlistService';
import { cartService } from './CartService';

describe('WishlistService', () => {
  let wishlistService: WishlistService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
    
    // Create a fresh instance
    wishlistService = new WishlistService();
  });

  describe('addItem', () => {
    it('should add a product to the wishlist', () => {
      wishlistService.addItem('product-1');
      
      expect(wishlistService.isInWishlist('product-1')).toBe(true);
      expect(wishlistService.getItemCount()).toBe(1);
    });

    it('should not add duplicate products', () => {
      wishlistService.addItem('product-1');
      wishlistService.addItem('product-1');
      
      expect(wishlistService.getItemCount()).toBe(1);
    });

    it('should persist to localStorage', () => {
      wishlistService.addItem('product-1');
      
      const stored = localStorage.getItem('a1_furniture_wishlist');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.items).toHaveLength(1);
      expect(parsed.items[0].productId).toBe('product-1');
    });
  });

  describe('removeItem', () => {
    it('should remove a product from the wishlist', () => {
      wishlistService.addItem('product-1');
      wishlistService.removeItem('product-1');
      
      expect(wishlistService.isInWishlist('product-1')).toBe(false);
      expect(wishlistService.getItemCount()).toBe(0);
    });

    it('should handle removing non-existent product', () => {
      wishlistService.removeItem('non-existent');
      
      expect(wishlistService.getItemCount()).toBe(0);
    });
  });

  describe('isInWishlist', () => {
    it('should return true for products in wishlist', () => {
      wishlistService.addItem('product-1');
      
      expect(wishlistService.isInWishlist('product-1')).toBe(true);
    });

    it('should return false for products not in wishlist', () => {
      expect(wishlistService.isInWishlist('product-1')).toBe(false);
    });
  });

  describe('toggleItem', () => {
    it('should add product if not in wishlist', () => {
      wishlistService.toggleItem('product-1');
      
      expect(wishlistService.isInWishlist('product-1')).toBe(true);
    });

    it('should remove product if already in wishlist', () => {
      wishlistService.addItem('product-1');
      wishlistService.toggleItem('product-1');
      
      expect(wishlistService.isInWishlist('product-1')).toBe(false);
    });

    it('should return to original state after two toggles', () => {
      const initialCount = wishlistService.getItemCount();
      
      wishlistService.toggleItem('product-1');
      wishlistService.toggleItem('product-1');
      
      expect(wishlistService.getItemCount()).toBe(initialCount);
      expect(wishlistService.isInWishlist('product-1')).toBe(false);
    });
  });

  describe('getWishlist', () => {
    it('should return products with full details', async () => {
      wishlistService.addItem('prod-1');
      
      const products = await wishlistService.getWishlist();
      
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe('prod-1');
      expect(products[0].name).toBeTruthy();
    });

    it('should return empty array for empty wishlist', async () => {
      const products = await wishlistService.getWishlist();
      
      expect(products).toHaveLength(0);
    });

    it('should handle products that no longer exist', async () => {
      wishlistService.addItem('non-existent-product');
      
      const products = await wishlistService.getWishlist();
      
      // Should not throw error, just skip missing products
      expect(products).toHaveLength(0);
    });
  });

  describe('moveToCart', () => {
    it('should add product to cart and remove from wishlist', async () => {
      wishlistService.addItem('prod-1');
      
      await wishlistService.moveToCart('prod-1');
      
      expect(wishlistService.isInWishlist('prod-1')).toBe(false);
      expect(cartService.getItemCount()).toBeGreaterThan(0);
    });

    it('should throw error if product not in wishlist', async () => {
      await expect(
        wishlistService.moveToCart('non-existent')
      ).rejects.toThrow('not in wishlist');
    });
  });

  describe('clearWishlist', () => {
    it('should remove all items from wishlist', () => {
      wishlistService.addItem('product-1');
      wishlistService.addItem('product-2');
      wishlistService.addItem('product-3');
      
      wishlistService.clearWishlist();
      
      expect(wishlistService.getItemCount()).toBe(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should load wishlist from localStorage on initialization', () => {
      wishlistService.addItem('product-1');
      wishlistService.addItem('product-2');
      
      // Create new instance to test loading
      const newService = new WishlistService();
      
      expect(newService.getItemCount()).toBe(2);
      expect(newService.isInWishlist('product-1')).toBe(true);
      expect(newService.isInWishlist('product-2')).toBe(true);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('a1_furniture_wishlist', 'invalid json');
      
      const newService = new WishlistService();
      
      expect(newService.getItemCount()).toBe(0);
    });
  });
});
