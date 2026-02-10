import { describe, it, expect, beforeEach } from 'vitest';
import {
  supportsWebP,
  getOptimizedImageUrl,
  generateSrcSet,
  getResponsiveImageUrl,
  generateSizes,
} from './imageUtils';

describe('imageUtils', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  describe('supportsWebP', () => {
    it('returns a boolean', () => {
      const result = supportsWebP();
      expect(typeof result).toBe('boolean');
    });

    it('returns false in test environment', () => {
      // In test environment without canvas support, should return false
      const result = supportsWebP();
      expect(result).toBe(false);
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('returns original URL if already WebP', () => {
      const url = 'image.webp';
      expect(getOptimizedImageUrl(url)).toBe(url);
    });

    it('returns original URL if data URL', () => {
      const url = 'data:image/png;base64,abc123';
      expect(getOptimizedImageUrl(url)).toBe(url);
    });

    it('returns original URL if placeholder', () => {
      const url = 'https://via.placeholder.com/300';
      expect(getOptimizedImageUrl(url)).toBe(url);
    });

    it('returns original URL if external URL', () => {
      const url = 'https://example.com/image.jpg';
      expect(getOptimizedImageUrl(url)).toBe(url);
    });
  });

  describe('generateSrcSet', () => {
    it('generates srcset with default sizes', () => {
      const url = 'image.jpg';
      const srcset = generateSrcSet(url);
      expect(srcset).toContain('320w');
      expect(srcset).toContain('640w');
      expect(srcset).toContain('960w');
      expect(srcset).toContain('1280w');
    });

    it('generates srcset with custom sizes', () => {
      const url = 'image.jpg';
      const srcset = generateSrcSet(url, [400, 800]);
      expect(srcset).toContain('400w');
      expect(srcset).toContain('800w');
    });
  });

  describe('getResponsiveImageUrl', () => {
    it('returns a URL for the specified width', () => {
      const url = 'image.jpg';
      const result = getResponsiveImageUrl(url, 640);
      expect(result).toBe(url);
    });
  });

  describe('generateSizes', () => {
    it('generates sizes with default breakpoints', () => {
      const sizes = generateSizes();
      expect(sizes).toContain('100vw');
      expect(sizes).toContain('50vw');
      expect(sizes).toContain('33vw');
    });

    it('generates sizes with custom breakpoints', () => {
      const sizes = generateSizes({
        '(max-width: 768px)': '90vw',
        default: '50vw',
      });
      expect(sizes).toContain('90vw');
      expect(sizes).toContain('50vw');
    });
  });
});
