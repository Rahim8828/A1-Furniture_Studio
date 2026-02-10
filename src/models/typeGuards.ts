// Type Guards and Validation Utilities for A1 Furniture Studio

import type {
  Product,
  ProductDetail,
  Cart,
  CartItem,
  Order,
  User,
  Wishlist,
  Address,
  ContactInfo,
  PaymentMethod,
  OrderStatus,
  PaymentStatus,
  ValidationResult,
} from './types';

// ============================================================================
// Type Guards
// ============================================================================

export function isProduct(obj: unknown): obj is Product {
  if (typeof obj !== 'object' || obj === null) return false;
  const p = obj as Record<string, unknown>;
  
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.slug === 'string' &&
    typeof p.description === 'string' &&
    typeof p.shortDescription === 'string' &&
    typeof p.price === 'number' &&
    typeof p.category === 'string' &&
    typeof p.imageUrl === 'string' &&
    typeof p.rating === 'number' &&
    typeof p.ratingCount === 'number' &&
    typeof p.inStock === 'boolean' &&
    typeof p.sku === 'string' &&
    p.createdAt instanceof Date &&
    p.updatedAt instanceof Date
  );
}

export function isProductDetail(obj: unknown): obj is ProductDetail {
  if (!isProduct(obj)) return false;
  const pd = obj as unknown as Record<string, unknown>;
  
  return (
    Array.isArray(pd.images) &&
    typeof pd.materials === 'object' &&
    typeof pd.dimensions === 'object' &&
    typeof pd.specifications === 'object' &&
    typeof pd.deliveryInfo === 'string' &&
    typeof pd.warrantyInfo === 'string'
  );
}

export function isCartItem(obj: unknown): obj is CartItem {
  if (typeof obj !== 'object' || obj === null) return false;
  const ci = obj as Record<string, unknown>;
  
  return (
    typeof ci.productId === 'string' &&
    isProduct(ci.product) &&
    typeof ci.quantity === 'number' &&
    typeof ci.priceAtAdd === 'number' &&
    typeof ci.itemTotal === 'number'
  );
}

export function isCart(obj: unknown): obj is Cart {
  if (typeof obj !== 'object' || obj === null) return false;
  const c = obj as Record<string, unknown>;
  
  return (
    typeof c.id === 'string' &&
    typeof c.sessionId === 'string' &&
    Array.isArray(c.items) &&
    c.items.every(isCartItem) &&
    typeof c.subtotal === 'number' &&
    typeof c.total === 'number' &&
    c.createdAt instanceof Date &&
    c.updatedAt instanceof Date
  );
}

export function isOrder(obj: unknown): obj is Order {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  
  return (
    typeof o.id === 'string' &&
    typeof o.orderId === 'string' &&
    Array.isArray(o.items) &&
    typeof o.subtotal === 'number' &&
    typeof o.shippingCost === 'number' &&
    typeof o.total === 'number' &&
    isOrderStatus(o.status) &&
    isPaymentMethod(o.paymentMethod) &&
    isPaymentStatus(o.paymentStatus) &&
    isAddress(o.deliveryAddress) &&
    isContactInfo(o.contactInfo) &&
    o.orderDate instanceof Date
  );
}

export function isUser(obj: unknown): obj is User {
  if (typeof obj !== 'object' || obj === null) return false;
  const u = obj as Record<string, unknown>;
  
  return (
    typeof u.id === 'string' &&
    typeof u.email === 'string' &&
    typeof u.passwordHash === 'string' &&
    typeof u.name === 'string' &&
    Array.isArray(u.addresses) &&
    Array.isArray(u.wishlist) &&
    Array.isArray(u.orders) &&
    u.createdAt instanceof Date
  );
}

export function isWishlist(obj: unknown): obj is Wishlist {
  if (typeof obj !== 'object' || obj === null) return false;
  const w = obj as Record<string, unknown>;
  
  return (
    typeof w.id === 'string' &&
    typeof w.sessionId === 'string' &&
    Array.isArray(w.items) &&
    w.createdAt instanceof Date &&
    w.updatedAt instanceof Date
  );
}

export function isAddress(obj: unknown): obj is Address {
  if (typeof obj !== 'object' || obj === null) return false;
  const a = obj as Record<string, unknown>;
  
  return (
    typeof a.fullName === 'string' &&
    typeof a.addressLine1 === 'string' &&
    typeof a.city === 'string' &&
    typeof a.state === 'string' &&
    typeof a.pincode === 'string' &&
    typeof a.phone === 'string'
  );
}

export function isContactInfo(obj: unknown): obj is ContactInfo {
  if (typeof obj !== 'object' || obj === null) return false;
  const ci = obj as Record<string, unknown>;
  
  return (
    typeof ci.email === 'string' &&
    typeof ci.phone === 'string'
  );
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'COD' || value === 'ONLINE';
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    value === 'PENDING' ||
    value === 'CONFIRMED' ||
    value === 'SHIPPED' ||
    value === 'DELIVERED' ||
    value === 'CANCELLED'
  );
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return (
    value === 'PENDING' ||
    value === 'PAID' ||
    value === 'FAILED' ||
    value === 'REFUNDED'
  );
}

// ============================================================================
// Validation Utilities
// ============================================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Indian phone number format: 10 digits
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

export function validatePincode(pincode: string): boolean {
  // Indian pincode format: 6 digits
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
}

export function validateAddress(address: Address): ValidationResult {
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
  
  if (!validatePincode(address.pincode)) {
    errors.push('Invalid pincode format (must be 6 digits)');
  }
  
  if (!validatePhone(address.phone)) {
    errors.push('Invalid phone number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateContactInfo(contactInfo: ContactInfo): ValidationResult {
  const errors: string[] = [];
  
  if (!validateEmail(contactInfo.email)) {
    errors.push('Invalid email format');
  }
  
  if (!validatePhone(contactInfo.phone)) {
    errors.push('Invalid phone number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateCartItem(item: CartItem): ValidationResult {
  const errors: string[] = [];
  
  if (item.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }
  
  if (item.priceAtAdd < 0) {
    errors.push('Price cannot be negative');
  }
  
  if (item.itemTotal !== item.quantity * item.priceAtAdd) {
    errors.push('Item total does not match quantity × price');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateCart(cart: Cart): ValidationResult {
  const errors: string[] = [];
  
  // Validate each cart item
  for (const item of cart.items) {
    const itemValidation = validateCartItem(item);
    if (!itemValidation.isValid) {
      errors.push(...itemValidation.errors);
    }
  }
  
  // Validate cart totals
  const calculatedSubtotal = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);
  if (Math.abs(cart.subtotal - calculatedSubtotal) > 0.01) {
    errors.push('Cart subtotal does not match sum of item totals');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateOrderData(
  items: CartItem[],
  deliveryAddress: Address,
  contactInfo: ContactInfo,
  paymentMethod: PaymentMethod
): ValidationResult {
  const errors: string[] = [];
  
  if (items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  const addressValidation = validateAddress(deliveryAddress);
  if (!addressValidation.isValid) {
    errors.push(...addressValidation.errors);
  }
  
  const contactValidation = validateContactInfo(contactInfo);
  if (!contactValidation.isValid) {
    errors.push(...contactValidation.errors);
  }
  
  if (!isPaymentMethod(paymentMethod)) {
    errors.push('Invalid payment method');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
