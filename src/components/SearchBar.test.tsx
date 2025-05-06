import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders the search input', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });

  it('calls onSearch with the query when form is submitted', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    const form = input.closest('form');
    fireEvent.submit(form!);
    
    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  it('does not call onSearch when form is submitted with empty query', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const form = screen.getByPlaceholderText('Search articles...').closest('form');
    fireEvent.submit(form!);
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('accepts custom placeholder text', () => {
    render(<SearchBar onSearch={() => {}} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });
}); 