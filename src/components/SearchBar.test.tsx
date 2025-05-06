import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    const mockOnSearch = vi.fn();
    const { getByPlaceholderText } = render(<SearchBar onSearch={mockOnSearch} />);
    expect(getByPlaceholderText('Search news...')).toBeDefined();
  });

  it('renders with custom placeholder', () => {
    const mockOnSearch = vi.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} placeholder="Custom placeholder" />
    );
    expect(getByPlaceholderText('Custom placeholder')).toBeDefined();
  });
});