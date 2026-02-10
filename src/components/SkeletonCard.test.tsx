import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkeletonCard from './SkeletonCard';

describe('SkeletonCard', () => {
  it('renders skeleton card with animation', () => {
    const { container } = render(<SkeletonCard />);

    const skeletonCard = container.querySelector('.animate-pulse');
    expect(skeletonCard).toBeInTheDocument();
  });
});
