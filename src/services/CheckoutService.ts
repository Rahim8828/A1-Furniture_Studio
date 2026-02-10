import type {
  CheckoutSession,
  OrderData,
  Order,
  Address,
  ValidationResult,
  CartItem,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from '../models/types';
import { cartService } from './CartService';
import { authService } from './AuthService';

/**
 * CheckoutService handles checkout process and order creation
 * Supports both authenticated and guest checkout
 */
export class CheckoutService {
  private static readonly ORDERS_STORAGE_KEY = 'a1_furniture_orders';
  private static readonly ORDER_COUNTER_KEY = 'a1_furniture_order_counter';

  /**
   * Initiate checkout session from current cart
   * Creates a checkout session with items, totals, and shipping cost
   */
  initiateCheckout(items: CartItem[]): CheckoutSession {
    if (!items || items.length === 0) {
      throw new Error('Cannot initiate checkout with empty cart');
    }

    // Calculate subtotal from items
    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);

    // Calculate shipping cost (free for Mumbai, ₹500 for others)
    // For now, we'll determine this when address is provided
    const shippingCost = 0; // Will be calculated in calculateShipping

    const session: CheckoutSession = {
      sessionId: this.generateSessionId(),
      items: items.map(item => ({ ...item })), // Deep copy items
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
    };

    return session;
  }

  /**
   * Submit order and create order record
   * Handles both guest and authenticated checkout
   * @param clearCart - Whether to clear the cart after order (default: true, false for Buy Now)
   */
  async submitOrder(orderData: OrderData, clearCart: boolean = true): Promise<Order> {
    // Validate order data
    const validation = this.validateOrderData(orderData);
    if (!validation.isValid) {
      throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
    }

    // Validate address
    const addressValidation = this.validateAddress(orderData.deliveryAddress);
    if (!addressValidation.isValid) {
      throw new Error(`Address validation failed: ${addressValidation.errors.join(', ')}`);
    }

    // Calculate shipping cost based on address
    const shippingCost = this.calculateShipping(orderData.deliveryAddress);

    // Calculate subtotal
    const subtotal = orderData.items.reduce((sum, item) => sum + item.itemTotal, 0);

    // Get current user if authenticated
    const currentUser = authService.getCurrentUser();
    const userId = !orderData.isGuestCheckout && currentUser ? currentUser.id : undefined;

    // Create order
    const order: Order = {
      id: this.generateOrderId(),
      orderId: this.generateHumanReadableOrderId(),
      userId,
      items: this.convertCartItemsToOrderItems(orderData.items),
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      status: 'PENDING' as OrderStatus,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'PENDING' : 'PENDING' as PaymentStatus,
      deliveryAddress: { ...orderData.deliveryAddress },
      contactInfo: { ...orderData.contactInfo },
      orderDate: new Date(),
      estimatedDelivery: this.calculateEstimatedDelivery(),
    };

    // Save order
    this.saveOrder(order);

    // Clear cart after successful order (only if clearCart is true)
    if (clearCart) {
      cartService.clearCart();
    }

    return order;
  }

  /**
   * Validate delivery address
   * Checks all required fields are present and valid
   */
  validateAddress(address: Address): ValidationResult {
    const errors: string[] = [];

    if (!address.fullName || address.fullName.trim().length === 0) {
      errors.push('Full name is required');
    }

    if (!address.addressLine1 || address.addressLine1.trim().length === 0) {
      errors.push('Address line 1 is required');
    }

    if (!address.city || address.city.trim().length === 0) {
      errors.push('City is required');
    }

    if (!address.state || address.state.trim().length === 0) {
      errors.push('State is required');
    }

    if (!address.pincode || address.pincode.trim().length === 0) {
      errors.push('Pincode is required');
    } else if (!/^\d{6}$/.test(address.pincode)) {
      errors.push('Pincode must be 6 digits');
    }

    if (!address.phone || address.phone.trim().length === 0) {
      errors.push('Phone number is required');
    } else if (!/^[+]?[\d\s-()]{10,}$/.test(address.phone)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate shipping cost based on delivery address
   * Free delivery for Mumbai, ₹500 for other locations
   */
  calculateShipping(address: Address): number {
    // Normalize city name for comparison
    const city = address.city.toLowerCase().trim();
    
    // Free delivery for Mumbai
    if (city === 'mumbai' || city === 'bombay') {
      return 0;
    }

    // ₹500 for other locations
    return 500;
  }

  /**
   * Get all orders for current user
   * Returns empty array for guest users
   */
  getOrders(): Order[] {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const allOrders = this.loadOrders();
    return allOrders.filter(order => order.userId === currentUser.id);
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: string): Order | null {
    const allOrders = this.loadOrders();
    return allOrders.find(order => order.id === orderId || order.orderId === orderId) || null;
  }

  /**
   * Validate complete order data before submission
   */
  private validateOrderData(orderData: OrderData): ValidationResult {
    const errors: string[] = [];

    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    // Validate contact info
    if (!orderData.contactInfo.email || orderData.contactInfo.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.contactInfo.email)) {
      errors.push('Invalid email format');
    }

    if (!orderData.contactInfo.phone || orderData.contactInfo.phone.trim().length === 0) {
      errors.push('Contact phone is required');
    }

    // Validate payment method
    if (!orderData.paymentMethod || !['COD', 'ONLINE'].includes(orderData.paymentMethod)) {
      errors.push('Valid payment method is required (COD or ONLINE)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert cart items to order items
   */
  private convertCartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.priceAtAdd,
      itemTotal: item.itemTotal,
    }));
  }

  /**
   * Generate unique order ID (internal)
   */
  private generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate human-readable order ID
   * Format: A1F-YYYYMMDD-XXXX (e.g., A1F-20240115-0001)
   */
  private generateHumanReadableOrderId(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get and increment counter
    const counter = this.getAndIncrementOrderCounter();
    const counterStr = String(counter).padStart(4, '0');
    
    return `A1F-${year}${month}${day}-${counterStr}`;
  }

  /**
   * Get and increment order counter
   */
  private getAndIncrementOrderCounter(): number {
    try {
      const stored = localStorage.getItem(CheckoutService.ORDER_COUNTER_KEY);
      const counter = stored ? parseInt(stored, 10) : 0;
      const nextCounter = counter + 1;
      localStorage.setItem(CheckoutService.ORDER_COUNTER_KEY, String(nextCounter));
      return nextCounter;
    } catch (error) {
      console.error('Error managing order counter:', error);
      return Math.floor(Math.random() * 9999) + 1;
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate estimated delivery date
   * Default: 7 days from order date
   */
  private calculateEstimatedDelivery(): Date {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return deliveryDate;
  }

  /**
   * Save order to localStorage
   */
  private saveOrder(order: Order): void {
    try {
      const orders = this.loadOrders();
      orders.push(order);
      localStorage.setItem(CheckoutService.ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
      throw new Error('Failed to save order');
    }
  }

  /**
   * Load all orders from localStorage
   */
  private loadOrders(): Order[] {
    try {
      const stored = localStorage.getItem(CheckoutService.ORDERS_STORAGE_KEY);
      if (stored) {
        const orders = JSON.parse(stored);
        // Convert date strings back to Date objects
        orders.forEach((order: Order) => {
          order.orderDate = new Date(order.orderDate);
          if (order.estimatedDelivery) {
            order.estimatedDelivery = new Date(order.estimatedDelivery);
          }
        });
        return orders;
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
    return [];
  }
}

// Export singleton instance
export const checkoutService = new CheckoutService();

