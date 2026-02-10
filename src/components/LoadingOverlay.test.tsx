import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingOverlay from './LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders loading overlay with default message', () => {
    render(<LoadingOverlay />);

    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders loading overlay with custom message', () => {
    render(<LoadingOverlay message="Please wait..." />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
