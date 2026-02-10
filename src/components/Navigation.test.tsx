import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';

describe('Navigation Component', () => {
  const defaultProps = {
    cartItemCount: 0,
    wishlistItemCount: 0,
    isAuthenticated: false,
    onSearch: vi.fn(),
  };

  const renderNavigation = (props = {}) => {
    return render(
      <BrowserRouter>
        <Navigation {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  it('renders logo', () => {
    renderNavigation();
    expect(screen.getByText('A1 Furniture Studio')).toBeInTheDocument();
  });

  it('displays cart item count when items exist', () => {
    renderNavigation({ cartItemCount: 3 });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays wishlist item count when items exist', () => {
    renderNavigation({ wishlistItemCount: 5 });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows login icon when not authenticated', () => {
    renderNavigation({ isAuthenticated: false });
    const links = screen.getAllByRole('link');
    const loginLink = links.find(link => link.getAttribute('href') === '/login');
    expect(loginLink).toBeDefined();
  });

  it('shows account link when authenticated', () => {
    renderNavigation({ isAuthenticated: true, userName: 'John Doe' });
    const accountLink = screen.getByRole('link', { name: /john doe/i });
    expect(accountLink).toHaveAttribute('href', '/account');
  });
});
