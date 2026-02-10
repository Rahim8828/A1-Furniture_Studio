import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { CartService } from './CartService';
import { mockProductDetails } from '../data/mockProducts';
import { productService } from './ProductService';

/**
 * Property-Based Tests for CartService
 * Feature: a1-furniture-ecommerce
 */

describe('CartService - Property-Based Tests', () => {
  let cartService: CartService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    cartService = new CartService();
    
    // Speed up tests by removing artificial delay
    vi.spyOn(productService as any, 'delay').mockResolvedValue(undefined);
  });

  /**
   * Property 12: Cart total calculation invariant
   * Validates: Requirements 6.4
   * 
   * For any cart state, verify total equals sum of all item totals
   */
  it('Property 12: Cart total calculation invariant', async () => {
    // Arbitrary for generating cart items
    const cartItemArbitrary = fc.record({
      productId: fc.constantFrom(...mockProductDetails.map(p => p.id)),
      quantity: fc.integer({ min: 1, max: 10 })
    });

    // Arbitrary for generating a list of cart items (reduced to 5 max for speed)
    const cartItemsArbitrary = fc.array(cartItemArbitrary, { minLength: 1, maxLength: 5 });

    await fc.assert(
      fc.asyncProperty(cartItemsArbitrary, async (items) => {
        // Clear cart before each property test iteration
        cartService.clearCart();

        // Add all items to cart
        for (const item of items) {
          await cartService.addItem(item.productId, item.quantity);
        }

        const cart = cartService.getCart();

        // Calculate expected total manually
        const expectedTotal = cart.items.reduce((sum, item) => {
          return sum + item.itemTotal;
        }, 0);

        // Property: cart.total should equal sum of all item.itemTotal
        expect(cart.total).toBe(expectedTotal);
        expect(cart.subtotal).toBe(expectedTotal);

        // Additional invariant: each item's itemTotal should equal quantity * priceAtAdd
        cart.items.forEach(item => {
          expect(item.itemTotal).toBe(item.quantity * item.priceAtAdd);
        });
      }),
      { numRuns: 100 }
    );
  }, 30000); // 30 second timeout for property-based test
});
