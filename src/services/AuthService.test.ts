import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import authService from './AuthService';
import type { RegistrationData } from '../models/types';

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset mock users
    authService.clearMockUsers();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const result = await authService.login('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.user?.name).toBe('Test User');
      expect(result.error).toBeUndefined();
    });

    it('should fail login with invalid email', async () => {
      const result = await authService.login('wrong@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.error).toBe('Invalid email or password');
    });

    it('should fail login with invalid password', async () => {
      const result = await authService.login('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.error).toBe('Invalid email or password');
    });

    it('should store session token in localStorage on successful login', async () => {
      await authService.login('test@example.com', 'password123');

      const token = localStorage.getItem('a1_furniture_auth_token');
      expect(token).toBeDefined();
      expect(token).toContain('token_');
    });

    it('should store current user in localStorage on successful login', async () => {
      await authService.login('test@example.com', 'password123');

      const userJson = localStorage.getItem('a1_furniture_current_user');
      expect(userJson).toBeDefined();
      
      const user = JSON.parse(userJson!);
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBeUndefined(); // Should not store password hash
    });
  });

  describe('logout', () => {
    it('should remove session token from localStorage', async () => {
      await authService.login('test@example.com', 'password123');
      expect(localStorage.getItem('a1_furniture_auth_token')).toBeDefined();

      authService.logout();

      expect(localStorage.getItem('a1_furniture_auth_token')).toBeNull();
    });

    it('should remove current user from localStorage', async () => {
      await authService.login('test@example.com', 'password123');
      expect(localStorage.getItem('a1_furniture_current_user')).toBeDefined();

      authService.logout();

      expect(localStorage.getItem('a1_furniture_current_user')).toBeNull();
    });
  });

  describe('register', () => {
    it('should successfully register a new user with valid data', async () => {
      const registrationData: RegistrationData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        phone: '+91 9876543210',
      };

      const result = await authService.register(registrationData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('newuser@example.com');
      expect(result.user?.name).toBe('New User');
      expect(result.error).toBeUndefined();
    });

    it('should fail registration with existing email', async () => {
      const registrationData: RegistrationData = {
        email: 'test@example.com', // Already exists
        password: 'password123',
        name: 'Test User',
      };

      const result = await authService.register(registrationData);

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.error).toBe('An account with this email already exists');
    });

    it('should fail registration with invalid email format', async () => {
      const registrationData: RegistrationData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      const result = await authService.register(registrationData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should fail registration with short password', async () => {
      const registrationData: RegistrationData = {
        email: 'newuser@example.com',
        password: '12345', // Too short
        name: 'Test User',
      };

      const result = await authService.register(registrationData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters long');
    });

    it('should fail registration with empty name', async () => {
      const registrationData: RegistrationData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: '',
      };

      const result = await authService.register(registrationData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should store session token in localStorage on successful registration', async () => {
      const registrationData: RegistrationData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      await authService.register(registrationData);

      const token = localStorage.getItem('a1_furniture_auth_token');
      expect(token).toBeDefined();
      expect(token).toContain('token_');
    });

    it('should authenticate user automatically after registration', async () => {
      const registrationData: RegistrationData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      await authService.register(registrationData);

      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user is logged in', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when user is logged in', async () => {
      await authService.login('test@example.com', 'password123');

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', async () => {
      await authService.login('test@example.com', 'password123');
      expect(authService.isAuthenticated()).toBe(true);

      authService.logout();

      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return false with invalid token', () => {
      localStorage.setItem('a1_furniture_auth_token', 'invalid_token');

      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('should return current user when logged in', async () => {
      await authService.login('test@example.com', 'password123');

      const user = authService.getCurrentUser();

      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
      expect(user?.name).toBe('Test User');
    });

    it('should return null after logout', async () => {
      await authService.login('test@example.com', 'password123');
      expect(authService.getCurrentUser()).toBeDefined();

      authService.logout();

      expect(authService.getCurrentUser()).toBeNull();
    });

    it('should not include password hash in returned user', async () => {
      await authService.login('test@example.com', 'password123');

      const user = authService.getCurrentUser();

      expect(user).toBeDefined();
      expect((user as any).passwordHash).toBeUndefined();
    });

    it('should convert date strings to Date objects', async () => {
      await authService.login('test@example.com', 'password123');

      const user = authService.getCurrentUser();

      expect(user).toBeDefined();
      expect(user?.createdAt).toBeInstanceOf(Date);
      expect(user?.lastLogin).toBeInstanceOf(Date);
    });
  });
});
