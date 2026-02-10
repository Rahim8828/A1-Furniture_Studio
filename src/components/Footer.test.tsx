import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer Component', () => {
  const renderFooter = () => {
    return render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  };

  it('renders company name', () => {
    renderFooter();
    expect(screen.getByText('A1 Furniture Studio')).toBeInTheDocument();
  });

  it('displays phone number', () => {
    renderFooter();
    expect(screen.getByText('+91 98765 43210')).toBeInTheDocument();
  });

  it('displays email address', () => {
    renderFooter();
    expect(screen.getByText('info@a1furniturestudio.com')).toBeInTheDocument();
  });

  it('displays physical address', () => {
    renderFooter();
    expect(
      screen.getByText(/123 Furniture Street, Andheri West, Mumbai/)
    ).toBeInTheDocument();
  });

  it('displays business hours', () => {
    renderFooter();
    expect(screen.getByText('Business Hours:')).toBeInTheDocument();
    expect(screen.getByText('Mon - Sat: 10:00 AM - 8:00 PM')).toBeInTheDocument();
  });

  it('renders WhatsApp button', () => {
    renderFooter();
    expect(screen.getByText('Chat on WhatsApp')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    renderFooter();
    const socialLinks = screen.getAllByRole('link', { name: /facebook|instagram|twitter|youtube/i });
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('displays copyright information', () => {
    renderFooter();
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} A1 Furniture Studio`))
    ).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    renderFooter();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About Us' })).toBeInTheDocument();
  });

  it('renders customer support section', () => {
    renderFooter();
    expect(screen.getByText('Customer Support')).toBeInTheDocument();
  });
});
