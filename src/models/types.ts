// Core Data Models and Types for A1 Furniture Studio E-Commerce

// ============================================================================
// Supporting Types
// ============================================================================

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export type PaymentMethod = 'COD' | 'ONLINE';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface MaterialInfo {
  woodType?: string;
  fabric?: string;
  polish?: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

// ============================================================================
// Product Models
// ============================================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  category: string;
  subcategory?: string;
  imageUrl: string; // Primary image for card display
  rating: number;
  ratingCount: number;
  inStock: boolean;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDetail extends Product {
  images: ProductImage[];
  materials: MaterialInfo;
  dimensions: Dimensions;
  specifications: Record<string, string>;
  deliveryInfo: string;
  warrantyInfo: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

// ============================================================================
// Cart Models
// ============================================================================

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  priceAtAdd: number;
  itemTotal: number;
}

export interface Cart {
  id: string;
  userId?: string; // null for guest carts
  sessionId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Wishlist Models
// ============================================================================

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface Wishlist {
  id: string;
  userId?: string; // null for guest wishlists
  sessionId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Order Models
// ============================================================================

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  itemTotal: number;
}

export interface Order {
  id: string;
  orderId: string; // human-readable order number
  userId?: string; // null for guest orders
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  contactInfo: ContactInfo;
  orderDate: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
}

// ============================================================================
// User Models
// ============================================================================

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
  orders: string[]; // order IDs
  createdAt: Date;
  lastLogin?: Date;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// ============================================================================
// Checkout Models
// ============================================================================

export interface CheckoutSession {
  sessionId: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface OrderData {
  items: CartItem[];
  deliveryAddress: Address;
  contactInfo: ContactInfo;
  paymentMethod: PaymentMethod;
  isGuestCheckout: boolean;
}

// ============================================================================
// Authentication Models
// ============================================================================

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// ============================================================================
// Validation Result
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
