import { vi } from 'vitest';
import CocktailCard from './CocktailCard';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

describe('CocktailCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render CocktailCard with props', () => {
    const props = {
      name: 'Mojito',
      image: 'https://example.com/mojito.jpg',
      isFavored: false,
      rating: 4,
      indexForTest: '0',
      handleRemoveFavorite: vi.fn(),
      handleAddFavorite: vi.fn(),
      handleCardClick: vi.fn(),
    };

    render(<CocktailCard {...props} />);

    expect(screen.getByText('Mojito')).toBeInTheDocument();
    expect(screen.getByText('(4)')).toBeInTheDocument();
    expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();
  });

  it('should call handleAddFavorite when clicking on the empty favorite icon', async () => {
    const props = {
      name: 'Mojito',
      image: 'https://example.com/mojito.jpg',
      isFavored: false,
      indexForTest: '0',
      rating: 4,
      handleRemoveFavorite: vi.fn(),
      handleAddFavorite: vi.fn(),
      handleCardClick: vi.fn(),
    };

    render(<CocktailCard {...props} />);

    const favoriteIcon = screen.getByTestId('FavoriteBorderIcon');

    fireEvent.click(favoriteIcon);
    expect(props.handleAddFavorite).toHaveBeenCalledWith('Mojito');
  });

  it('should call handleRemoveFavorite when clicking on the filled favorite icon', async () => {
    const props = {
      name: 'Mojito',
      image: 'https://example.com/mojito.jpg',
      isFavored: true,
      indexForTest: '0',
      rating: 4,
      handleRemoveFavorite: vi.fn(),
      handleAddFavorite: vi.fn(),
      handleCardClick: vi.fn(),
    };

    render(<CocktailCard {...props} />);

    const favoriteIcon = screen.getByTestId('FavoriteIcon');

    fireEvent.click(favoriteIcon);
    expect(props.handleRemoveFavorite).toHaveBeenCalledWith('Mojito');
  });
});
