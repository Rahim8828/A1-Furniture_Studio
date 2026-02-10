/**
 * Utility functions for image optimization
 */

/**
 * Check if the browser supports WebP format
 */
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if we've already cached the result
  const cached = sessionStorage.getItem('webp-support');
  if (cached !== null) {
    return cached === 'true';
  }

  // Create a test canvas
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // Check if toDataURL supports WebP
    const result = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    sessionStorage.setItem('webp-support', result.toString());
    return result;
  }

  return false;
};

/**
 * Convert image URL to WebP format if supported
 * @param url - Original image URL
 * @returns WebP URL if supported, otherwise original URL
 */
export const getOptimizedImageUrl = (url: string): string => {
  // Handle undefined or null URLs
  if (!url) {
    return url;
  }

  // Don't convert if already WebP or if it's a data URL
  if (url.endsWith('.webp') || url.startsWith('data:')) {
    return url;
  }

  // Check if browser supports WebP
  if (!supportsWebP()) {
    return url;
  }

  // For placeholder images or external URLs, return as-is
  if (url.includes('placeholder') || url.startsWith('http')) {
    return url;
  }

  // Convert to WebP by replacing extension
  return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
};

/**
 * Generate srcset for responsive images
 * @param baseUrl - Base image URL
 * @param sizes - Array of widths for responsive images
 * @returns srcset string
 */
export const generateSrcSet = (baseUrl: string, sizes: number[] = [320, 640, 960, 1280]): string => {
  return sizes
    .map((size) => {
      const url = getResponsiveImageUrl(baseUrl, size);
      return `${url} ${size}w`;
    })
    .join(', ');
};

/**
 * Get responsive image URL for a specific width
 * @param url - Original image URL
 * @param width - Desired width
 * @returns Responsive image URL
 */
export const getResponsiveImageUrl = (url: string, _width: number): string => {
  // For now, return the original URL
  // In a real implementation, this would point to a CDN or image service
  // that can resize images on the fly (e.g., Cloudinary, Imgix)
  return url;
};

/**
 * Get sizes attribute for responsive images
 * @param breakpoints - Object mapping breakpoints to sizes
 * @returns sizes string
 */
export const generateSizes = (
  breakpoints: Record<string, string> = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    default: '33vw',
  }
): string => {
  const entries = Object.entries(breakpoints);
  const mediaQueries = entries
    .filter(([key]) => key !== 'default')
    .map(([query, size]) => `${query} ${size}`);

  const defaultSize = breakpoints.default || '100vw';
  return [...mediaQueries, defaultSize].join(', ');
};
