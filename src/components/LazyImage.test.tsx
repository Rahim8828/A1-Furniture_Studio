import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import LazyImage from './LazyImage';

describe('LazyImage', () => {
  it('renders with placeholder initially', () => {
    const { container } = render(<LazyImage src="test.jpg" alt="Test image" />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('applies custom className', () => {
    const { container } = render(<LazyImage src="test.jpg" alt="Test image" className="custom-class" />);
    const img = container.querySelector('img');
    expect(img).toHaveClass('custom-class');
  });

  it('sets loading attribute to lazy', () => {
    const { container } = render(<LazyImage src="test.jpg" alt="Test image" />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('calls onLoad callback when image loads', async () => {
    const onLoad = vi.fn();
    const { container } = render(<LazyImage src="test.jpg" alt="Test image" onLoad={onLoad} />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    
    // Simulate image load
    if (img) {
      img.dispatchEvent(new Event('load'));
    }
    
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  it('calls onError callback when image fails to load', async () => {
    const onError = vi.fn();
    const { container } = render(<LazyImage src="invalid.jpg" alt="Test image" onError={onError} />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    
    // Simulate image error
    if (img) {
      img.dispatchEvent(new Event('error'));
    }
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });
});
