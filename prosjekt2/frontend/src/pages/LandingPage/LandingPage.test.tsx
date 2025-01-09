import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from './LandingPage';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi, Mock } from 'vitest';
import { useUsername } from '../../hooks/useUsername';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../hooks/useUsername');

describe('LandingPage Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main elements', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /Shaken & Stirred/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
  });

  it('displays dynamic phrases sequentially', async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const phrases = [
      'Unleash a world of cocktails tailored to every taste.',
      'Shaken, stirred, or straight up — dive into expertly curated cocktails designed to elevate every occasion.',
    ];

    for (const phrase of phrases) {
      await waitFor(() => {
        expect(screen.getByText(phrase.slice(0, 5), { exact: false })).toBeInTheDocument();
      });
    }
  });

  it('navigates to /home if username exists', async () => {
    (useUsername as Mock).mockReturnValue('testUser');

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', { name: /Get Started/i });
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('navigates to /login if username does not exist', async () => {
    (useUsername as Mock).mockReturnValue(null);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', { name: /Get Started/i });
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
