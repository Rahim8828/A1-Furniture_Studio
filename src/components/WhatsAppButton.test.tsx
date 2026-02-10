import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WhatsAppButton from './WhatsAppButton';

describe('WhatsAppButton', () => {
  it('should render the WhatsApp button', () => {
    render(<WhatsAppButton />);
    const button = screen.getByRole('button', { name: /chat on whatsapp/i });
    expect(button).toBeInTheDocument();
  });

  it('should have fixed positioning classes', () => {
    render(<WhatsAppButton />);
    const button = screen.getByRole('button', { name: /chat on whatsapp/i });
    expect(button).toHaveClass('fixed');
    expect(button).toHaveClass('bottom-6');
    expect(button).toHaveClass('right-6');
  });

  it('should open WhatsApp with pre-filled message when clicked', async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    
    render(<WhatsAppButton />);
    const button = screen.getByRole('button', { name: /chat on whatsapp/i });
    
    await user.click(button);
    
    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/919876543210'),
      '_blank'
    );
    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hello!%20I%20would%20like%20to%20inquire%20about%20your%20furniture.'),
      '_blank'
    );
    
    windowOpenSpy.mockRestore();
  });

  it('should have green background color', () => {
    render(<WhatsAppButton />);
    const button = screen.getByRole('button', { name: /chat on whatsapp/i });
    expect(button).toHaveClass('bg-green-500');
  });

  it('should have proper accessibility attributes', () => {
    render(<WhatsAppButton />);
    const button = screen.getByRole('button', { name: /chat on whatsapp/i });
    expect(button).toHaveAttribute('aria-label', 'Chat on WhatsApp');
    expect(button).toHaveAttribute('title', 'Chat on WhatsApp');
  });
});
