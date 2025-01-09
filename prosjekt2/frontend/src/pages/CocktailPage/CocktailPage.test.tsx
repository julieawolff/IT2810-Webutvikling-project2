import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, Mock } from 'vitest';
import CocktailPage from './CocktailPage';
import { QUERY_COCKTAIL_PAGE } from '../../api/Queries';
import { useFavorites } from '../../hooks/useFavorites';

vi.mock('../../hooks/useFavorites', () => ({
  useFavorites: vi.fn(),
}));

const mockFavorites = {
  favorites: [],
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
};

vi.mock('../../components/CommentSection/CommentSection', () => ({
  default: () => <div data-testid="comment-section">Comment Section</div>,
}));

vi.mock('../../components/IngredientsList/IngredientsList', () => ({
  default: () => <div data-testid="ingredients-list">Ingredients List</div>,
}));

vi.mock('../../components/InstructionList/InstructionList', () => ({
  default: () => <div data-testid="instruction-list">Instruction List</div>,
}));

beforeAll(() => {
  window.scrollTo = vi.fn();
});

describe('CocktailPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useFavorites as Mock).mockReturnValue(mockFavorites);
  });

  const mockCocktail = {
    name: 'Margarita',
    instructions: 'Mix ingredients and serve over ice.',
    image: 'https://example.com/margarita.jpg',
    ratingSum: 4.5,
    ingredientsConnection: {
      edges: [
        {
          properties: { measure: '1 oz' },
          node: { name: 'Tequila' },
        },
      ],
    },
  };

  const mocks = [
    {
      request: {
        query: QUERY_COCKTAIL_PAGE,
        variables: { cocktailName: 'Margarita' },
      },
      result: {
        data: {
          cocktailByName: [mockCocktail],
        },
      },
    },
  ];

  it('renders loading state initially', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/cocktails/Margarita']}>
          <Routes>
            <Route path="/cocktails/:name" element={<CocktailPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state if query fails', async () => {
    const errorMocks = [
      {
        request: {
          query: QUERY_COCKTAIL_PAGE,
          variables: { cocktailName: 'Margarita' },
        },
        error: new Error('Failed to fetch'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter initialEntries={['/cocktails/Margarita']}>
          <Routes>
            <Route path="/cocktails/:name" element={<CocktailPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    const errorComponent = await screen.findByText(/Error/i);
    expect(errorComponent).toBeInTheDocument();
  });

  it('renders the cocktail details when data is loaded', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/cocktails/Margarita']}>
          <Routes>
            <Route path="/cocktails/:name" element={<CocktailPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    const title = await screen.findByText('Margarita');
    expect(title).toBeInTheDocument();
    expect(screen.getByText('Margarita')).toBeInTheDocument();
    expect(screen.getByTestId('ingredients-list')).toBeInTheDocument();
    expect(screen.getByTestId('instruction-list')).toBeInTheDocument();
    expect(screen.getByTestId('comment-section')).toBeInTheDocument();
  });

  it('toggles favorite status when heart icon is clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/cocktails/Margarita']}>
          <Routes>
            <Route path="/cocktails/:name" element={<CocktailPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    const favoriteIcon = await screen.findByTestId('FavoriteBorderIcon');
    fireEvent.click(favoriteIcon);

    expect(mockFavorites.addFavorite).toHaveBeenCalledWith('Margarita');

    const favoriteIconFilled = await screen.findByTestId('FavoriteIcon');
    fireEvent.click(favoriteIconFilled);
    expect(mockFavorites.removeFavorite).toHaveBeenCalledWith('Margarita');
  });
});
