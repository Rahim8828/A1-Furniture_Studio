import type { Wishlist, WishlistItem, Product } from '../models/types';
import { productService } from './ProductService';
import { cartService } from './CartService';

/**
 * WishlistService handles all wishlist operations
 * with localStorage persistence for guest users
 */
export class WishlistService {
  private static readonly STORAGE_KEY = 'a1_furniture_wishlist';
  private wishlist: Wishlist;

  constructor() {
    this.wishlist = this.loadWishlist();
  }

  /**
   * Add an item to the wishlist
   * If item already exists, this is a no-op (toggle behavior handled by caller)
   */
  addItem(productId: string): void {
    // Check if product already in wishlist
    const exists = this.wishlist.items.some(
      item => item.productId === productId
    );

    if (!exists) {
      const newItem: WishlistItem = {
        productId,
        addedAt: new Date()
      };
      this.wishlist.items.push(newItem);
      this.wishlist.updatedAt = new Date();
      this.saveWishlist();
    }
  }

  /**
   * Remove an item from the wishlist
   */
  removeItem(productId: string): void {
    this.wishlist.items = this.wishlist.items.filter(
      item => item.productId !== productId
    );
    this.wishlist.updatedAt = new Date();
    this.saveWishlist();
  }

  /**
   * Get all wishlist items with full product details
   */
  async getWishlist(): Promise<Product[]> {
    const products: Product[] = [];
    
    for (const item of this.wishlist.items) {
      try {
        const productDetail = await productService.getProductById(item.productId);
        if (productDetail) {
          products.push(this.convertToProduct(productDetail));
        }
      } catch (error) {
        console.error(`Error loading product ${item.productId}:`, error);
      }
    }
    
    return products;
  }

  /**
   * Check if a product is in the wishlist
   */
  isInWishlist(productId: string): boolean {
    return this.wishlist.items.some(item => item.productId === productId);
  }

  /**
   * Move an item from wishlist to cart
   * Adds to cart and removes from wishlist
   */
  async moveToCart(productId: string): Promise<void> {
    if (!this.isInWishlist(productId)) {
      throw new Error(`Product ${productId} is not in wishlist`);
    }

    // Add to cart
    await cartService.addItem(productId, 1);
    
    // Remove from wishlist
    this.removeItem(productId);
  }

  /**
   * Toggle item in wishlist (add if not present, remove if present)
   */
  toggleItem(productId: string): void {
    if (this.isInWishlist(productId)) {
      this.removeItem(productId);
    } else {
      this.addItem(productId);
    }
  }

  /**
   * Get the raw wishlist data
   */
  getWishlistData(): Wishlist {
    return { ...this.wishlist };
  }

  /**
   * Get the number of items in the wishlist
   */
  getItemCount(): number {
    return this.wishlist.items.length;
  }

  /**
   * Clear all items from the wishlist
   */
  clearWishlist(): void {
    this.wishlist.items = [];
    this.wishlist.updatedAt = new Date();
    this.saveWishlist();
  }

  /**
   * Load wishlist from localStorage
   */
  private loadWishlist(): Wishlist {
    try {
      const stored = localStorage.getItem(WishlistService.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.updatedAt = new Date(parsed.updatedAt);
        parsed.items.forEach((item: WishlistItem) => {
          item.addedAt = new Date(item.addedAt);
        });
        return parsed;
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }

    // Return empty wishlist if nothing stored or error occurred
    return this.createEmptyWishlist();
  }

  /**
   * Save wishlist to localStorage
   */
  private saveWishlist(): void {
    try {
      localStorage.setItem(WishlistService.STORAGE_KEY, JSON.stringify(this.wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }

  /**
   * Create an empty wishlist
   */
  private createEmptyWishlist(): Wishlist {
    return {
      id: this.generateId(),
      sessionId: this.generateSessionId(),
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Generate a unique wishlist ID
   */
  private generateId(): string {
    return `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Convert ProductDetail to Product
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
export const wishlistService = new WishlistService();
