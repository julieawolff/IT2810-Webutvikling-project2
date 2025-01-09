import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Navbar from './Navbar';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock for theme state (dark/light mode)
const mockStore = (themeState: boolean) => {
  return configureStore({
    reducer: {
      theme: (state = { isDarkMode: themeState }) => state,
    },
  });
};

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    MemoryRouter: ({ children }: { children: React.ReactNode }) => children, // Ensure this returns children properly
    useNavigate: vi.fn(),
  };
});

describe('Navbar', () => {
  it('renders the Navbar with correct logo and title', () => {
    const store = mockStore(false);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Shaken & Stirred')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toHaveAttribute('src', expect.stringContaining('cocktail_logo.avif'));
  });

  it('renders dark mode logo when isDarkMode is true', () => {
    const store = mockStore(true);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByAltText('logo')).toHaveAttribute('src', expect.stringContaining('dark_cocktail_logo.avif'));
  });

  it('does not render the user icon when no username is present', () => {
    const store = mockStore(false);

    vi.mock('../../hooks/useUsername', () => ({
      useUsername: () => null,
    }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByRole('button', { name: /user icon/i })).toBeNull();
  });

  it('renders the user icon when a username is present', () => {
    const store = mockStore(false);

    vi.mock('../../hooks/useUsername.ts', () => ({
      useUsername: vi.fn(() => 'testUser'),
    }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
  });
  it('navigates to the user page when the user icon is clicked', () => {
    const store = mockStore(false);
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mock('../../hooks/useUsername', () => ({
      useUsername: () => 'testUser',
    }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('AccountCircleIcon'));

    expect(mockNavigate).toHaveBeenCalledWith('/user/testUser');
  });
});
