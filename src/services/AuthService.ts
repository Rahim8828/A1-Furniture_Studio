import type { User, RegistrationData, AuthResult } from '../models/types';

// Mock user database stored in memory
const mockUsers: Map<string, User> = new Map();

// Session token key for localStorage
const SESSION_TOKEN_KEY = 'a1_furniture_auth_token';
const CURRENT_USER_KEY = 'a1_furniture_current_user';

// Initialize with some mock users for testing
const initializeMockUsers = () => {
  if (mockUsers.size === 0) {
    // Add a default test user
    const testUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: hashPassword('password123'), // Mock hash
      name: 'Test User',
      phone: '+91 9876543210',
      addresses: [],
      wishlist: [],
      orders: [],
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
    };
    mockUsers.set(testUser.email, testUser);
  }
};

// Simple mock password hashing (NOT for production use)
const hashPassword = (password: string): string => {
  // In a real app, use bcrypt or similar
  return `hashed_${password}`;
};

// Verify password against hash
const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Generate a mock session token
const generateToken = (userId: string): string => {
  return `token_${userId}_${Date.now()}`;
};

// Parse user from token
const parseToken = (token: string): string | null => {
  const parts = token.split('_');
  if (parts.length >= 2 && parts[0] === 'token') {
    return parts[1]; // Return userId
  }
  return null;
};

class AuthService {
  constructor() {
    initializeMockUsers();
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const user = mockUsers.get(email);

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      if (!verifyPassword(password, user.passwordHash)) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Update last login
      user.lastLogin = new Date();

      // Generate session token
      const token = generateToken(user.id);

      // Store token and user in localStorage
      localStorage.setItem(SESSION_TOKEN_KEY, token);
      
      // Store user without password hash
      const userWithoutPassword = { ...user };
      delete (userWithoutPassword as any).passwordHash;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      return {
        success: false,
        error: 'An error occurred during login',
      };
    }
  }

  /**
   * Log out the current user
   */
  logout(): void {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  /**
   * Register a new user
   */
  async register(userData: RegistrationData): Promise<AuthResult> {
    try {
      // Check if user already exists
      if (mockUsers.has(userData.email)) {
        return {
          success: false,
          error: 'An account with this email already exists',
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          error: 'Invalid email format',
        };
      }

      // Validate password length
      if (userData.password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long',
        };
      }

      // Validate name
      if (!userData.name || userData.name.trim().length === 0) {
        return {
          success: false,
          error: 'Name is required',
        };
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        passwordHash: hashPassword(userData.password),
        name: userData.name,
        phone: userData.phone,
        addresses: [],
        wishlist: [],
        orders: [],
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      // Add to mock database
      mockUsers.set(newUser.email, newUser);

      // Generate session token
      const token = generateToken(newUser.id);

      // Store token and user in localStorage
      localStorage.setItem(SESSION_TOKEN_KEY, token);
      
      // Store user without password hash
      const userWithoutPassword = { ...newUser };
      delete (userWithoutPassword as any).passwordHash;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      return {
        success: false,
        error: 'An error occurred during registration',
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!token) {
      return false;
    }

    const userId = parseToken(token);
    if (!userId) {
      return false;
    }

    // Verify user still exists in mock database
    const user = Array.from(mockUsers.values()).find(u => u.id === userId);
    return !!user;
  }

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (!userJson) {
      return null;
    }

    try {
      const user = JSON.parse(userJson);
      // Convert date strings back to Date objects
      user.createdAt = new Date(user.createdAt);
      if (user.lastLogin) {
        user.lastLogin = new Date(user.lastLogin);
      }
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get mock users (for testing purposes only)
   */
  getMockUsers(): User[] {
    return Array.from(mockUsers.values());
  }

  /**
   * Clear all mock users (for testing purposes only)
   */
  clearMockUsers(): void {
    mockUsers.clear();
    initializeMockUsers();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
