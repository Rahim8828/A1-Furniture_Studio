import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders search input with placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Search furniture..." />);
    expect(screen.getByPlaceholderText('Search furniture...')).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'sofa' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(onSearch).toHaveBeenCalledWith('sofa');
  });

  it('calls onSearch when Enter key is pressed', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'table' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSearch).toHaveBeenCalledWith('table');
  });

  it('does not call onSearch with empty query', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.submit(input.closest('form')!);
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('trims whitespace from search query', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: '  chair  ' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(onSearch).toHaveBeenCalledWith('chair');
  });

  it('renders search button', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });
});
