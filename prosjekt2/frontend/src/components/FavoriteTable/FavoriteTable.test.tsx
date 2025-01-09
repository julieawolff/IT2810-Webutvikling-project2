import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FavoriteTable from './FavoriteTable';
import { MockedProvider } from '@apollo/client/testing';
import { QUERY_USER_FAVORITES } from '../../api/Queries';
import { vi, Mock } from 'vitest';
import { useNavigate } from 'react-router-dom';
import { FavoritesProvider } from '../../hooks/useFavorites';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('FavoriteTable', () => {
  const mocks = [
    {
      request: {
        query: QUERY_USER_FAVORITES,
        variables: { username: 'testUser' },
      },
      result: {
        data: {
          cocktailsFavoredByUser: [
            { name: 'Margarita', image: 'margarita.jpg', ratingSum: 5 },
            { name: 'Old Fashioned', image: 'old-fashioned.jpg', ratingSum: 4 },
          ],
        },
      },
    },
  ];

  it('renders loading state correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FavoritesProvider>
          <FavoriteTable userName="testUser" />
        </FavoritesProvider>
      </MockedProvider>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders favorites correctly when data is fetched', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FavoritesProvider>
          <FavoriteTable userName="testUser" />
        </FavoritesProvider>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText('Margarita'));

    expect(screen.getByText('Margarita')).toBeInTheDocument();
    expect(screen.getByText('Old Fashioned')).toBeInTheDocument();
  });
  it('renders "no favorites" message when there are no favorites', async () => {
    const emptyMocks = [
      {
        request: {
          query: QUERY_USER_FAVORITES,
          variables: { username: 'testUser' },
        },
        result: {
          data: {
            cocktailsFavoredByUser: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <FavoritesProvider>
          <FavoriteTable userName="testUser" />
        </FavoritesProvider>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText("You don't have any favorites 🥹"));
    expect(screen.getByText("You don't have any favorites 🥹")).toBeInTheDocument();
  });
  it('navigates to cocktail page on card click', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FavoritesProvider>
          <FavoriteTable userName="testUser" />
        </FavoritesProvider>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText('Margarita'));
    fireEvent.click(screen.getByText('Margarita'));

    expect(mockNavigate).toHaveBeenCalledWith('/cocktail/Margarita');
  });
});
