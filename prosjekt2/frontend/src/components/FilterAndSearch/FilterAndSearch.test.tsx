import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import FilterAndSearch from './FilterAndSearch';

describe('FilterAndSearch Component', () => {
  const mockHandleFiltering = vi.fn();
  const mockHandleSorting = vi.fn();
  const mockHandleSearch = vi.fn();

  const initialProps = {
    handleFiltering: mockHandleFiltering,
    handleSorting: mockHandleSorting,
    handleSearch: mockHandleSearch,
    initialSort: 'Name A-Z',
    initialFilter: ['Gin', 'Rum'],
  };

  beforeEach(() => {
    render(<FilterAndSearch {...initialProps} />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial filter and sorting options', () => {
    // Filter-check
    const filterCombobox = screen.getByRole('combobox', { name: /Filter/i });
    expect(filterCombobox).toBeInTheDocument();

    // Sort-check
    const sortElement = screen.getByRole('combobox', { name: /Sorting/i });
    expect(sortElement).toHaveTextContent(initialProps.initialSort);

    // Search-check
    const searchField = screen.getByLabelText(/Search/i);
    expect(searchField).toBeInTheDocument();
  });

  it('calls handleFiltering with selected filters', () => {
    const filterSelect = screen.getByRole('combobox', { name: /Filter/i });
    fireEvent.mouseDown(filterSelect);

    const option = screen.getByRole('option', { name: /Vodka/i });
    fireEvent.click(option);

    expect(mockHandleFiltering).toHaveBeenCalledWith(expect.arrayContaining(['Gin', 'Rum', 'Vodka']));
  });

  it('calls handleSorting with selected sorting option', () => {
    const sortSelect = screen.getByRole('combobox', { name: /Sorting/i });
    fireEvent.mouseDown(sortSelect);

    const sortOption = screen.getByRole('option', { name: /Rating High-Low/i });
    fireEvent.click(sortOption);

    expect(mockHandleSorting).toHaveBeenCalledWith('Rating High-Low');
  });

  it('calls handleSearch with search input value', () => {
    const searchField = screen.getByLabelText(/Search/i);
    fireEvent.change(searchField, { target: { value: 'Margarita' } });

    expect(mockHandleSearch).toHaveBeenCalledWith('Margarita');
  });
});
