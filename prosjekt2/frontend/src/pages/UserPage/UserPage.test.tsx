import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { vi, Mock } from 'vitest';
import UserPage from './UserPage';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useUsername } from '../../hooks/useUsername';
import { QUERY_USER_FAVORITES, QUERY_USER_BY_NAME, QUERY_USER_REVIEWS } from '../../api/Queries';
import { UPDATE_USERNAME } from '../../api/Mutations';
import { FavoritesProvider } from '../../hooks/useFavorites'; // Import the context provider
import { MockedProvider } from '@apollo/client/testing';

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
    useParams: vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

vi.mock('../../hooks/useUsername', () => ({
  useUsername: vi.fn(),
}));

describe('UserPage', () => {
  const mocks = [
    {
      request: {
        query: QUERY_USER_FAVORITES,
        variables: { username: 'testUser' },
      },
    },
    {
      request: {
        query: QUERY_USER_BY_NAME,
        variables: { name: 'newUsername' },
      },
      result: {
        data: {
          users: [],
        },
      },
    },
    {
      request: {
        query: UPDATE_USERNAME,
        variables: {
          where: { name: 'oldUsername' },
          update: { name: 'newUsername' },
        },
      },
      result: {
        data: {
          updateUsers: {
            users: [{ name: 'newUsername' }],
          },
        },
      },
    },
    {
      request: {
        query: QUERY_USER_REVIEWS,
        variables: { userName: 'testUser' },
      },
      result: {
        data: {
          reviewsByUser: [
            { rating: 5, description: 'Great!', cocktail: 'Mojito' },
            { rating: 4, description: 'Good', cocktail: 'Margarita' },
            { rating: 3, description: 'Ok', cocktail: 'Old Fashioned' },
          ],
        },
      },
    },
    {
      request: {
        query: QUERY_USER_REVIEWS,
        variables: { userName: 'testUser' },
      },
      result: {
        data: {
          reviewsByUser: [
            { rating: 1, description: 'Meh!', cocktail: 'Espresso Rumtini' },
            { rating: 5, description: 'Good<3', cocktail: 'Limeade' },
            { rating: 3, description: 'Ok', cocktail: 'Lone Tree Cooler' },
          ],
        },
      },
    },
  ];

  const mockNavigate = vi.fn();
  const mockUseLazyQuery = useLazyQuery as Mock;
  const mockUseMutation = useMutation as Mock;
  const mockUseParams = useParams as Mock;
  const mockUseUsername = useUsername as Mock;

  beforeEach(() => {
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    mockUseParams.mockReturnValue({ name: 'testUser' });
    mockUseUsername.mockReturnValue('testUser');
    mockUseLazyQuery.mockReturnValue([vi.fn().mockResolvedValue({ data: { users: [] } })]);
    mockUseMutation.mockReturnValue([
      vi.fn().mockResolvedValue({ data: { updateUsers: { users: [{ name: 'updatedUser' }] } } }),
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <FavoritesProvider>
            <UserPage />
          </FavoritesProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText(/Welcome, testUser!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go back/i })).toBeInTheDocument();
    expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
  });

  it('navigates back when "Go back" button is clicked', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <FavoritesProvider>
            <UserPage />
          </FavoritesProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    const goBackButton = screen.getByRole('button', { name: /Go back/i });
    fireEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('should handle input change (change username) and save', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FavoritesProvider>
          <UserPage />
        </FavoritesProvider>
      </MockedProvider>,
    );

    const editButton = screen.getByTestId('EditIcon');
    fireEvent.click(editButton);

    const textField = screen.getByRole('textbox');
    fireEvent.change(textField, { target: { value: 'newTestUser' } });

    const saveButton = screen.getByTestId('EditIcon');
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/user/newTestUser'));
  });

  it('should handle attempt at saving with an empty username', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FavoritesProvider>
          <UserPage />
        </FavoritesProvider>
      </MockedProvider>,
    );

    const editButton = screen.getByTestId('EditIcon');
    fireEvent.click(editButton);

    const textField = screen.getByRole('textbox');
    fireEvent.change(textField, { target: { value: '' } });

    const saveButton = screen.getByTestId('EditIcon');
    fireEvent.click(saveButton);

    await waitFor(() => expect(screen.getByText('Username cannot be empty')).toBeInTheDocument());
  });
});
