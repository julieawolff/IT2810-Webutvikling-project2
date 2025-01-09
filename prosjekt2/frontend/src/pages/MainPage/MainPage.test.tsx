import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import MainPage from './MainPage';
import { QUERY_COCKTAILS } from '../../api/Queries.tsx';
import { Cocktail } from '../../api/types.ts';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesProvider } from '../../hooks/useFavorites';

vi.mock('../../hooks/useFavorites.tsx', () => ({
  useFavorites: () => ({
    favorites: ['Mojito', 'Margarita'],
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }),
  FavoritesProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../hooks/useUsername.ts', () => ({
  useUsername: vi.fn(() => 'testUser'),
}));

const mocks = [
  {
    request: {
      query: QUERY_COCKTAILS,
      variables: {
        limit: 8,
        offset: 0,
        filter: [],
        sort: 'Rating High-Low',
        searchPrefix: '',
      },
    },
    result: {
      data: {
        cocktailsForMainPage: [
          { name: 'Mojito', image: '', ratingSum: 4, alcoholic: 'Alcoholic' },
          { name: 'Apello', image: '', ratingSum: 3, alcoholic: 'Non alcoholic' },
          { name: 'Margarita', image: '', ratingSum: 3, alcoholic: 'Alcoholic' },
          { name: 'Martini', image: '', ratingSum: 3, alcoholic: 'Alcoholic' },
          { name: 'Mangosa', image: '', ratingSum: 3, alcoholic: 'Alcoholic' },
          { name: 'Vodka Redbull', image: '', ratingSum: 3, alcoholic: 'Alcoholic' },
          { name: 'Gin Tonic', image: '', ratingSum: 3, alcoholic: 'Alcoholic' },
          { name: 'Lennart', image: '', ratingSum: 3, alcoholic: 'Alcoholic' },
        ] as Cocktail[],
        totalCocktailsCount: 20,
      },
    },
  },
  {
    request: {
      query: QUERY_COCKTAILS,
      variables: {
        limit: 8,
        offset: 8,
        filter: [],
        sort: 'Rating High-Low',
        searchPrefix: '',
      },
    },
    result: {
      data: {
        cocktailsForMainPage: [{ name: 'Moscow Mule', image: '', ratingSum: 2, alcoholic: 'Alcoholic' }] as Cocktail[],
        totalCocktailsCount: 20,
      },
    },
  },
  {
    request: {
      query: QUERY_COCKTAILS,
      variables: {
        limit: 8,
        offset: 0,
        filter: ['Non-alcoholic'],
        sort: 'Rating High-Low',
        searchPrefix: '',
      },
    },
    result: {
      data: {
        cocktailsForMainPage: [{ name: 'Apello', image: '', ratingSum: 3, alcoholic: 'Non alcoholic' }],
        totalCocktailsCount: 20,
      },
    },
  },
  {
    request: {
      query: QUERY_COCKTAILS,
      variables: {
        limit: 8,
        offset: 0,
        filter: [],
        sort: 'Rating High-Low',
        searchPrefix: 'Mojito',
      },
    },
    result: {
      data: {
        cocktailsForMainPage: [{ name: 'Mojito', image: '', ratingSum: 4, alcoholic: 'Alcoholic' }],
        totalCocktailsCount: 20,
      },
    },
  },
  {
    request: {
      query: QUERY_COCKTAILS,
      variables: {
        limit: 8,
        offset: 0,
        filter: [],
        sort: 'Rating High-Low',
        searchPrefix: 'nococktailbythisname',
      },
    },
    result: {
      data: {
        cocktailsForMainPage: [],
        totalCocktailsCount: 20,
      },
    },
  },
];

describe('MainPage', () => {
  it('renders the page correctly with loading state', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <FavoritesProvider>
            <MainPage />
          </FavoritesProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Good to see you testUser, what are you in the mood for today?✨')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays cocktails after data is fetched', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <FavoritesProvider>
            <MainPage />
          </FavoritesProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText('Mojito')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Apello')).toBeInTheDocument());
  });

  it('handles search input and updates displayed cocktails', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText('Apello')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Mojito')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Are you ready for it?');
    fireEvent.change(searchInput, { target: { value: 'Mojito' } });

    await waitFor(() => expect(screen.getByText('Mojito')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Apello')).not.toBeInTheDocument());
  });

  it('handles search input and updates displayed cocktails when there is no matches', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText('Apello')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Mojito')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Are you ready for it?');
    fireEvent.change(searchInput, { target: { value: 'nococktailbythisname' } });

    await waitFor(() => expect(screen.getByText('0 results - No cocktails matching your search')).toBeInTheDocument());
  });

  it('handles infinite scrolling and fetches more cocktails when scrolled to bottom', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText('Apello')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Mojito')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Margarita')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Martini')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Mangosa')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Gin Tonic')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Vodka Redbull')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Lennart')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Moscow Mule')).not.toBeInTheDocument());

    const mockScroll = new Event('scroll');
    Object.defineProperty(window, 'innerHeight', { value: 1000 });
    Object.defineProperty(document.documentElement, 'offsetHeight', { value: 2000 });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000 });

    window.dispatchEvent(mockScroll);

    await waitFor(() => expect(screen.getByText('Moscow Mule')).toBeInTheDocument());
  });

  it('displays error component when there is a query error', async () => {
    const errorMocks = [
      {
        request: {
          query: QUERY_COCKTAILS,
          variables: {
            limit: 8,
            offset: 0,
            filter: [],
            sort: 'Rating High-Low',
            searchPrefix: '',
          },
        },
        error: new Error('Error loading resource'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText('Error loading resource')).toBeInTheDocument());
  });

  it('applies filters and updates cocktails', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </MockedProvider>,
    );
    const filterSelect = screen.getByRole('combobox', { name: /Filter/i });
    fireEvent.mouseDown(filterSelect);

    const option = screen.getByRole('option', { name: /Non-alcoholic/i });
    fireEvent.click(option);

    await waitFor(() => expect(screen.getByText('Apello')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Mojito')).not.toBeInTheDocument());
  });
});
