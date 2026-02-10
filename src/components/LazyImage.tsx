import { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
}

const LazyImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  onLoad,
  onError,
  sizes,
  srcSet,
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load image immediately with WebP optimization
      const optimizedSrc = getOptimizedImageUrl(src);
      // Use queueMicrotask to avoid setState in effect warning
      queueMicrotask(() => setImageSrc(optimizedSrc));
      return;
    }

    const imgElement = imgRef.current;
    if (!imgElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, load it with WebP optimization
            setImageSrc(getOptimizedImageUrl(src));
            if (imgElement) {
              observer.unobserve(imgElement);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgElement);

    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = () => {
    setImageError(true);
    // Fallback to original image if WebP fails
    if (imageSrc !== src) {
      setImageSrc(src);
    }
    if (onError) {
      onError();
    }
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      srcSet={srcSet}
      style={imageError ? { backgroundColor: '#f3f4f6' } : undefined}
    />
  );
};

export default LazyImage;
