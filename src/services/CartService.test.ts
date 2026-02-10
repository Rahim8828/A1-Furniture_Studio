import { describe, it, expect, beforeEach } from 'vitest';
import { CartService } from './CartService';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
    
    // Create new instance for each test
    cartService = new CartService();
  });

  describe('addItem', () => {
    it('should add a new item to the cart', async () => {
      await cartService.addItem('prod-1', 1);
      
      const cart = cartService.getCart();
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe('prod-1');
      expect(cart.items[0].quantity).toBe(1);
    });

    it('should increment quantity for duplicate items', async () => {
      await cartService.addItem('prod-1', 1);
      await cartService.addItem('prod-1', 2);
      
      const cart = cartService.getCart();
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    it('should throw error for invalid quantity', async () => {
      await expect(cartService.addItem('prod-1', 0)).rejects.toThrow();
      await expect(cartService.addItem('prod-1', -1)).rejects.toThrow();
    });

    it('should throw error for non-existent product', async () => {
      await expect(cartService.addItem('invalid_id', 1)).rejects.toThrow();
    });

    it('should update cart total after adding item', async () => {
      await cartService.addItem('prod-1', 2);
      
      const cart = cartService.getCart();
      expect(cart.total).toBeGreaterThan(0);
      expect(cart.subtotal).toBe(cart.total);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', async () => {
      await cartService.addItem('prod-1', 1);
      await cartService.addItem('prod-2', 1);
      
      cartService.removeItem('prod-1');
      
      const cart = cartService.getCart();
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe('prod-2');
    });

    it('should update totals after removing item', async () => {
      await cartService.addItem('prod-1', 1);
      const totalBefore = cartService.getTotal();
      
      cartService.removeItem('prod-1');
      
      expect(cartService.getTotal()).toBe(0);
      expect(cartService.getTotal()).toBeLessThan(totalBefore);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      await cartService.addItem('prod-1', 1);
      
      cartService.updateQuantity('prod-1', 5);
      
      const cart = cartService.getCart();
      expect(cart.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', async () => {
      await cartService.addItem('prod-1', 1);
      
      cartService.updateQuantity('prod-1', 0);
      
      const cart = cartService.getCart();
      expect(cart.items).toHaveLength(0);
    });

    it('should update item total when quantity changes', async () => {
      await cartService.addItem('prod-1', 1);
      const cart1 = cartService.getCart();
      const pricePerItem = cart1.items[0].priceAtAdd;
      
      cartService.updateQuantity('prod-1', 3);
      
      const cart2 = cartService.getCart();
      expect(cart2.items[0].itemTotal).toBe(pricePerItem * 3);
    });
  });

  describe('getCart', () => {
    it('should return empty cart initially', () => {
      const cart = cartService.getCart();
      
      expect(cart.items).toHaveLength(0);
      expect(cart.total).toBe(0);
      expect(cart.subtotal).toBe(0);
    });

    it('should return cart with items after adding', async () => {
      await cartService.addItem('prod-1', 1);
      
      const cart = cartService.getCart();
      
      expect(cart.items).toHaveLength(1);
      expect(cart.total).toBeGreaterThan(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', async () => {
      await cartService.addItem('prod-1', 1);
      await cartService.addItem('prod-2', 2);
      
      cartService.clearCart();
      
      const cart = cartService.getCart();
      expect(cart.items).toHaveLength(0);
      expect(cart.total).toBe(0);
    });
  });

  describe('getItemCount', () => {
    it('should return 0 for empty cart', () => {
      expect(cartService.getItemCount()).toBe(0);
    });

    it('should return total quantity of all items', async () => {
      await cartService.addItem('prod-1', 2);
      await cartService.addItem('prod-2', 3);
      
      expect(cartService.getItemCount()).toBe(5);
    });
  });

  describe('getTotal', () => {
    it('should return 0 for empty cart', () => {
      expect(cartService.getTotal()).toBe(0);
    });

    it('should return correct total for cart with items', async () => {
      await cartService.addItem('prod-1', 1);
      
      const total = cartService.getTotal();
      const cart = cartService.getCart();
      
      expect(total).toBe(cart.total);
      expect(total).toBeGreaterThan(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist cart to localStorage', async () => {
      await cartService.addItem('prod-1', 2);
      
      const stored = localStorage.getItem('a1_furniture_cart');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.items).toHaveLength(1);
      expect(parsed.items[0].quantity).toBe(2);
    });

    it('should load cart from localStorage on initialization', async () => {
      await cartService.addItem('prod-1', 3);
      
      // Create new instance to test loading
      const newCartService = new CartService();
      const cart = newCartService.getCart();
      
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });
  });

  describe('discount application', () => {
    it('should apply discount price when adding discounted product to cart', async () => {
      // prod-1 has discountPrice: 38000, price: 45000
      await cartService.addItem('prod-1', 1);
      
      const cart = cartService.getCart();
      expect(cart.items[0].priceAtAdd).toBe(38000); // Should use discount price
      expect(cart.items[0].itemTotal).toBe(38000);
      expect(cart.total).toBe(38000);
    });

    it('should use regular price when product has no discount', async () => {
      // prod-2 has no discount, price: 32000
      await cartService.addItem('prod-2', 1);
      
      const cart = cartService.getCart();
      expect(cart.items[0].priceAtAdd).toBe(32000); // Should use regular price
      expect(cart.items[0].itemTotal).toBe(32000);
      expect(cart.total).toBe(32000);
    });

    it('should calculate correct total with mixed discounted and regular items', async () => {
      // prod-1: discountPrice 38000
      // prod-2: regular price 32000
      await cartService.addItem('prod-1', 2);
      await cartService.addItem('prod-2', 1);
      
      const cart = cartService.getCart();
      const expectedTotal = (38000 * 2) + (32000 * 1);
      expect(cart.total).toBe(expectedTotal);
      expect(cart.subtotal).toBe(expectedTotal);
    });
  });
});
