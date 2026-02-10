import { describe, it, expect, beforeEach } from 'vitest';
import { checkoutService } from './CheckoutService';
import { cartService } from './CartService';
import { authService } from './AuthService';
import type { CartItem, Address, OrderData, Product } from '../models/types';

describe('CheckoutService', () => {
  // Mock product for testing
  const mockProduct: Product = {
    id: 'prod-1',
    name: 'Test Sofa',
    slug: 'test-sofa',
    description: 'A comfortable test sofa',
    shortDescription: 'Test sofa',
    price: 25000,
    category: 'Sofas',
    imageUrl: '/images/sofa.jpg',
    rating: 4.5,
    ratingCount: 10,
    inStock: true,
    sku: 'SOF-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCartItem: CartItem = {
    productId: 'prod-1',
    product: mockProduct,
    quantity: 2,
    priceAtAdd: 25000,
    itemTotal: 50000,
  };

  const validAddress: Address = {
    fullName: 'John Doe',
    addressLine1: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 9876543210',
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cart
    cartService.clearCart();
    
    // Logout any authenticated user
    authService.logout();
    
    // Clear mock users
    authService.clearMockUsers();
  });

  describe('initiateCheckout', () => {
    it('should create checkout session with correct totals', () => {
      const items = [mockCartItem];
      const session = checkoutService.initiateCheckout(items);

      expect(session.sessionId).toBeDefined();
      expect(session.items).toHaveLength(1);
      expect(session.subtotal).toBe(50000);
      expect(session.total).toBe(50000); // No shipping initially
    });

    it('should throw error for empty cart', () => {
      expect(() => checkoutService.initiateCheckout([])).toThrow(
        'Cannot initiate checkout with empty cart'
      );
    });

    it('should create deep copy of items', () => {
      const items = [mockCartItem];
      const session = checkoutService.initiateCheckout(items);

      // Modify original item
      items[0].quantity = 999;

      // Session item should remain unchanged
      expect(session.items[0].quantity).toBe(2);
    });
  });

  describe('validateAddress', () => {
    it('should validate correct address', () => {
      const result = checkoutService.validateAddress(validAddress);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject address without full name', () => {
      const invalidAddress = { ...validAddress, fullName: '' };
      const result = checkoutService.validateAddress(invalidAddress);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Full name is required');
    });

    it('should reject address without address line 1', () => {
      const invalidAddress = { ...validAddress, addressLine1: '' };
      const result = checkoutService.validateAddress(invalidAddress);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Address line 1 is required');
    });

    it('should reject address without city', () => {
      const invalidAddress = { ...validAddress, city: '' };
      const result = checkoutService.validateAddress(invalidAddress);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('City is required');
    });

    it('should reject address with invalid pincode', () => {
      const invalidAddress = { ...validAddress, pincode: '12345' }; // Only 5 digits
      const result = checkoutService.validateAddress(invalidAddress);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Pincode must be 6 digits');
    });

    it('should reject address with invalid phone', () => {
      const invalidAddress = { ...validAddress, phone: '123' };
      const result = checkoutService.validateAddress(invalidAddress);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid phone number format');
    });
  });

  describe('calculateShipping', () => {
    it('should return 0 for Mumbai', () => {
      const mumbaiAddress = { ...validAddress, city: 'Mumbai' };
      const shipping = checkoutService.calculateShipping(mumbaiAddress);

      expect(shipping).toBe(0);
    });

    it('should return 0 for Bombay (alternate name)', () => {
      const bombayAddress = { ...validAddress, city: 'Bombay' };
      const shipping = checkoutService.calculateShipping(bombayAddress);

      expect(shipping).toBe(0);
    });

    it('should return 500 for other cities', () => {
      const delhiAddress = { ...validAddress, city: 'Delhi' };
      const shipping = checkoutService.calculateShipping(delhiAddress);

      expect(shipping).toBe(500);
    });

    it('should be case-insensitive for Mumbai', () => {
      const mumbaiAddress = { ...validAddress, city: 'MUMBAI' };
      const shipping = checkoutService.calculateShipping(mumbaiAddress);

      expect(shipping).toBe(0);
    });
  });

  describe('submitOrder', () => {
    it('should create order with guest checkout', async () => {
      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      const order = await checkoutService.submitOrder(orderData);

      expect(order.id).toBeDefined();
      expect(order.orderId).toMatch(/^A1F-\d{8}-\d{4}$/);
      expect(order.userId).toBeUndefined();
      expect(order.items).toHaveLength(1);
      expect(order.subtotal).toBe(50000);
      expect(order.shippingCost).toBe(0); // Mumbai
      expect(order.total).toBe(50000);
      expect(order.status).toBe('PENDING');
      expect(order.paymentMethod).toBe('COD');
      expect(order.paymentStatus).toBe('PENDING');
    });

    it('should create order with authenticated user', async () => {
      // Register and login user
      await authService.register({
        email: 'user@example.com',
        password: 'password123',
        name: 'Test User',
      });

      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'user@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'ONLINE',
        isGuestCheckout: false,
      };

      const order = await checkoutService.submitOrder(orderData);

      expect(order.userId).toBeDefined();
      expect(order.paymentMethod).toBe('ONLINE');
    });

    it('should include shipping cost for non-Mumbai addresses', async () => {
      const delhiAddress = { ...validAddress, city: 'Delhi' };
      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: delhiAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      const order = await checkoutService.submitOrder(orderData);

      expect(order.shippingCost).toBe(500);
      expect(order.total).toBe(50500); // 50000 + 500
    });

    it('should throw error for invalid address', async () => {
      const invalidAddress = { ...validAddress, pincode: '123' };
      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: invalidAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      await expect(checkoutService.submitOrder(orderData)).rejects.toThrow(
        'Address validation failed'
      );
    });

    it('should throw error for empty items', async () => {
      const orderData: OrderData = {
        items: [],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      await expect(checkoutService.submitOrder(orderData)).rejects.toThrow(
        'Order validation failed'
      );
    });

    it('should throw error for invalid email', async () => {
      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'invalid-email',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      await expect(checkoutService.submitOrder(orderData)).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('should generate unique order IDs', async () => {
      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      const order1 = await checkoutService.submitOrder(orderData);
      const order2 = await checkoutService.submitOrder(orderData);

      expect(order1.id).not.toBe(order2.id);
      expect(order1.orderId).not.toBe(order2.orderId);
    });
  });

  describe('getOrders', () => {
    it('should return empty array for guest users', () => {
      const orders = checkoutService.getOrders();
      expect(orders).toEqual([]);
    });

    it('should return orders for authenticated user', async () => {
      // Register and login user
      const registerResult = await authService.register({
        email: 'user@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(registerResult.success).toBe(true);

      // Create an order
      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'user@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: false,
      };

      const createdOrder = await checkoutService.submitOrder(orderData);
      expect(createdOrder.userId).toBeDefined();

      const orders = checkoutService.getOrders();
      expect(orders).toHaveLength(1);
      expect(orders[0].userId).toBe(createdOrder.userId);
    });
  });

  describe('cart clearing after order (Requirement 9.6)', () => {
    it('should clear cart after successful order submission', async () => {
      // Add items to cart
      await cartService.addItem('prod-1', 2);
      expect(cartService.getItemCount()).toBe(2);

      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      await checkoutService.submitOrder(orderData);

      // Verify cart is cleared
      expect(cartService.getItemCount()).toBe(0);
      expect(cartService.getCart().items).toHaveLength(0);
    });

    it('should NOT clear cart when clearCart parameter is false (Buy Now)', async () => {
      // Add items to cart
      await cartService.addItem('prod-1', 2);
      expect(cartService.getItemCount()).toBe(2);

      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      // Submit order with clearCart=false (Buy Now scenario)
      await checkoutService.submitOrder(orderData, false);

      // Verify cart is NOT cleared
      expect(cartService.getItemCount()).toBe(2);
      expect(cartService.getCart().items).toHaveLength(1);
    });
  });

  describe('getOrderById', () => {
    it('should retrieve order by internal ID', async () => {
      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      const createdOrder = await checkoutService.submitOrder(orderData);
      const retrievedOrder = checkoutService.getOrderById(createdOrder.id);

      expect(retrievedOrder).toBeDefined();
      expect(retrievedOrder?.id).toBe(createdOrder.id);
    });

    it('should retrieve order by human-readable ID', async () => {
      const orderData: OrderData = {
        items: [mockCartItem],
        deliveryAddress: validAddress,
        contactInfo: {
          email: 'test@example.com',
          phone: '+91 9876543210',
        },
        paymentMethod: 'COD',
        isGuestCheckout: true,
      };

      const createdOrder = await checkoutService.submitOrder(orderData);
      const retrievedOrder = checkoutService.getOrderById(createdOrder.orderId);

      expect(retrievedOrder).toBeDefined();
      expect(retrievedOrder?.orderId).toBe(createdOrder.orderId);
    });

    it('should return null for non-existent order', () => {
      const order = checkoutService.getOrderById('non-existent-id');
      expect(order).toBeNull();
    });
  });
});

