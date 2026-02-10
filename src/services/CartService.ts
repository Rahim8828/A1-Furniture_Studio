import type { Cart, CartItem, Product } from '../models/types';
import { productService } from './ProductService';

/**
 * CartService handles all shopping cart operations
 * with localStorage persistence for guest users
 */
export class CartService {
  private static readonly STORAGE_KEY = 'a1_furniture_cart';
  private cart: Cart;

  constructor() {
    this.cart = this.loadCart();
  }

  /**
   * Add an item to the cart
   * If item already exists, increment quantity
   */
  async addItem(productId: string, quantity: number = 1): Promise<void> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Get product details
    const productDetail = await productService.getProductById(productId);
    if (!productDetail) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Check if product already in cart
    const existingItemIndex = this.cart.items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Increment quantity for existing item
      this.cart.items[existingItemIndex].quantity += quantity;
      this.cart.items[existingItemIndex].itemTotal = 
        this.cart.items[existingItemIndex].quantity * 
        this.cart.items[existingItemIndex].priceAtAdd;
    } else {
      // Add new item to cart
      const price = productDetail.discountPrice ?? productDetail.price;
      const newItem: CartItem = {
        productId,
        product: this.convertToProduct(productDetail),
        quantity,
        priceAtAdd: price,
        itemTotal: price * quantity
      };
      this.cart.items.push(newItem);
    }

    this.updateTotals();
    this.saveCart();
  }

  /**
   * Remove an item from the cart
   */
  removeItem(productId: string): void {
    this.cart.items = this.cart.items.filter(
      item => item.productId !== productId
    );
    this.updateTotals();
    this.saveCart();
  }

  /**
   * Update the quantity of an item in the cart
   */
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.cart.items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      item.itemTotal = item.priceAtAdd * quantity;
      this.updateTotals();
      this.saveCart();
    }
  }

  /**
   * Get the current cart
   */
  getCart(): Cart {
    return { ...this.cart };
  }

  /**
   * Clear all items from the cart
   */
  clearCart(): void {
    this.cart.items = [];
    this.updateTotals();
    this.saveCart();
  }

  /**
   * Get the total number of items in the cart
   */
  getItemCount(): number {
    return this.cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Get the cart total
   */
  getTotal(): number {
    return this.cart.total;
  }

  /**
   * Update cart subtotal and total
   */
  private updateTotals(): void {
    this.cart.subtotal = this.cart.items.reduce(
      (sum, item) => sum + item.itemTotal,
      0
    );
    this.cart.total = this.cart.subtotal;
    this.cart.updatedAt = new Date();
  }

  /**
   * Load cart from localStorage
   */
  private loadCart(): Cart {
    try {
      const stored = localStorage.getItem(CartService.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.updatedAt = new Date(parsed.updatedAt);
        parsed.items.forEach((item: CartItem) => {
          item.product.createdAt = new Date(item.product.createdAt);
          item.product.updatedAt = new Date(item.product.updatedAt);
        });
        return parsed;
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }

    // Return empty cart if nothing stored or error occurred
    return this.createEmptyCart();
  }

  /**
   * Save cart to localStorage
   */
  private saveCart(): void {
    try {
      localStorage.setItem(CartService.STORAGE_KEY, JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  /**
   * Create an empty cart
   */
  private createEmptyCart(): Cart {
    return {
      id: this.generateId(),
      sessionId: this.generateSessionId(),
      items: [],
      subtotal: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Generate a unique cart ID
   */
  private generateId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate or retrieve session ID
   */
  private generateSessionId(): string {
    let sessionId = sessionStorage.getItem('a1_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('a1_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Convert ProductDetail to Product for cart storage
   */
  private convertToProduct(productDetail: any): Product {
    return {
      id: productDetail.id,
      name: productDetail.name,
      slug: productDetail.slug,
      description: productDetail.description,
      shortDescription: productDetail.shortDescription,
      price: productDetail.price,
      discountPrice: productDetail.discountPrice,
      discountPercentage: productDetail.discountPercentage,
      category: productDetail.category,
      subcategory: productDetail.subcategory,
      imageUrl: productDetail.imageUrl,
      rating: productDetail.rating,
      ratingCount: productDetail.ratingCount,
      inStock: productDetail.inStock,
      sku: productDetail.sku,
      createdAt: productDetail.createdAt,
      updatedAt: productDetail.updatedAt
    };
  }
}

// Export singleton instance
export const cartService = new CartService();
