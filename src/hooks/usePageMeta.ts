import { useEffect } from 'react';
import { seoService } from '../services/SEOService';
import type { PageType } from '../services/SEOService';

/**
 * Custom hook to set page-level SEO meta tags.
 * Sets document title, meta description, canonical URL, 
 * Open Graph tags, and keywords on mount.
 */
export function usePageMeta(pageType: PageType, data?: any) {
  useEffect(() => {
    const meta = seoService.generatePageMeta(pageType, data);

    // Set document title
    document.title = meta.title;

    // Helper to set or create a meta tag
    const setMeta = (attribute: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // Standard meta tags
    setMeta('name', 'description', meta.description);
    setMeta('name', 'keywords', meta.keywords.join(', '));

    // Open Graph
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:url', meta.canonicalUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'A1 Furniture Studio');
    if (meta.ogImage) {
      setMeta('property', 'og:image', meta.ogImage);
    }

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    if (meta.ogImage) {
      setMeta('name', 'twitter:image', meta.ogImage);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', meta.canonicalUrl);

    // Cleanup: reset title on unmount
    return () => {
      document.title = 'A1 Furniture Studio - Premium Furniture in Mumbai';
    };
  }, [pageType, data]);
}
