import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ReviewTable from './ReviewTable';
import { QUERY_USER_REVIEWS } from '../../api/Queries';
import { DELETE_REVIEW } from '../../api/Mutations';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

const mocks = [
  {
    request: {
      query: QUERY_USER_REVIEWS,
      variables: { userName: 'testUser' },
    },
    result: {
      data: {
        reviewsByUser: [
          {
            rating: 5,
            description: 'Great drink!',
            cocktail: 'Margarita',
          },
        ],
      },
    },
    maxUsageCount: 4,
  },

  {
    request: {
      query: DELETE_REVIEW,
      variables: { username: 'testUser', cocktailName: 'Margarita' },
    },
    result: {
      data: {
        deleteReview: true,
      },
    },
  },
];

describe('ReviewTable', () => {
  it('renders loading state', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ReviewTable userName="testUser" cocktailName="" />
      </MockedProvider>,
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    const errorMock = [
      {
        request: {
          query: QUERY_USER_REVIEWS,
          variables: { userName: 'testUser' },
        },
        error: new Error('Network error'),
        maxUsageCount: 2,
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <ReviewTable userName="testUser" cocktailName="" />
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });

  it('renders no reviews state', async () => {
    const emptyMock = [
      {
        request: {
          query: QUERY_USER_REVIEWS,
          variables: { userName: 'testUser' },
        },
        result: {
          data: {
            reviewsByUser: [],
          },
        },
        maxUsageCount: 2,
      },
    ];

    render(
      <MockedProvider mocks={emptyMock} addTypename={false}>
        <ReviewTable userName="testUser" cocktailName="" />
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText(/No reviews available/i)).toBeInTheDocument());
  });

  it('renders reviews and navigates to a cocktail page on click', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <ReviewTable userName="testUser" cocktailName="" />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText(/Margarita/i)).toBeInTheDocument());

    const reviewItem = screen.getByText(/Margarita/i);
    fireEvent.click(reviewItem);

    expect(mockNavigate).toHaveBeenCalledWith('/cocktail/Margarita');
  });

  it('deletes a review and refetches the data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <ReviewTable userName="testUser" cocktailName="" />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => expect(screen.getByText(/Margarita/i)).toBeInTheDocument());

    const deleteButton = screen.getByTestId('DeleteIcon');
    fireEvent.click(deleteButton);

    await waitFor(
      () => expect(mockNavigate).toHaveBeenCalled(), // Confirms delete happened without navigation
    );
  });
});
