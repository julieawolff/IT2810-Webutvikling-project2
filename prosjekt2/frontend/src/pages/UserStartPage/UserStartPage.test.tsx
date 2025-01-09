import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi, Mock } from 'vitest';
import UserStartPage from './UserStartPage';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Provider } from 'react-redux';
import store from '../../redux/store';

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useLazyQuery: vi.fn(),
    useMutation: vi.fn(),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as { MemoryRouter: typeof MemoryRouter };
  return {
    ...(actual as object),
    useNavigate: vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

describe('UserStartPage', () => {
  const mockNavigate = vi.fn();
  const mockUseLazyQuery = useLazyQuery as Mock;
  const mockUseMutation = useMutation as Mock;

  beforeEach(() => {
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    mockUseLazyQuery.mockReturnValue([vi.fn().mockResolvedValue({ data: { users: [] } })]);
    mockUseMutation.mockReturnValue([vi.fn().mockResolvedValue({ data: { createUser: { name: 'newUser' } } })]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRedux = (ui: JSX.Element) => {
    render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>,
    );
  };

  it('renders the page correctly', () => {
    renderWithRedux(<UserStartPage />);

    expect(screen.getByText(/Welcome to Shaken & Stirred!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type a username here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('shows an error if the username is empty', async () => {
    renderWithRedux(<UserStartPage />);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/Username cannot be empty/i)).toBeInTheDocument();
    });
  });

  it('navigates to /home when a valid username is submitted', async () => {
    renderWithRedux(<UserStartPage />);

    fireEvent.change(screen.getByPlaceholderText(/Type a username here/i), {
      target: { value: 'newUser' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
