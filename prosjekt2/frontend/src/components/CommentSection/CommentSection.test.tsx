import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QUERY_COMMENTS_FOR_COCKTAIL } from '../../api/Queries';
import CommentSection from './CommentSection';
import { vi } from 'vitest';

const mocks = [
  {
    request: {
      query: QUERY_COMMENTS_FOR_COCKTAIL,
      variables: { cocktailName: 'Mojito' },
    },
    result: {
      data: {
        commentsForCocktail: [
          {
            username: 'JohnDoe',
            description: 'Great cocktail!',
            rating: 5,
          },
        ],
      },
    },
  },
];

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as { MemoryRouter: typeof MemoryRouter };
  return {
    ...(actual as object),

    useParams: () => ({ name: 'Mojito' }),
    MemoryRouter: actual.MemoryRouter,
  };
});

describe('CommentSection', () => {
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/cocktail/Mojito']}>
          <Routes>
            <Route path="/cocktail/:name" element={<CommentSection cocktailName="Mojito" />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders comments after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/cocktail/Mojito']}>
          <Routes>
            <Route path="/cocktail/:name" element={<CommentSection cocktailName="Mojito" />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('JohnDoe')).toBeInTheDocument();
      expect(screen.getByText('Great cocktail!')).toBeInTheDocument();
      expect(screen.getByText('Rating: 5')).toBeInTheDocument();
    });
  });

  it('renders error state', async () => {
    const errorMocks = [
      {
        request: {
          query: QUERY_COMMENTS_FOR_COCKTAIL,
          variables: { cocktailName: 'Mojito' },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter initialEntries={['/cocktail/Mojito']}>
          <Routes>
            <Route path="/cocktail/:name" element={<CommentSection cocktailName="Mojito" />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading resource')).toBeInTheDocument();
    });
  });
});
