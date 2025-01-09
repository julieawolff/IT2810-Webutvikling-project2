import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import MiniCocktailCard from './MiniCocktailCard';

describe('MiniCocktailCard', () => {
  const handleRemoveFavorite = vi.fn();
  const handleAddFavorite = vi.fn();
  const handleCardClick = vi.fn();

  const cocktailProps = {
    name: 'Mojito',
    image: 'https://example.com/mojito.jpg',
    isFavored: false,
    rating: 4,
    handleRemoveFavorite,
    handleAddFavorite,
    handleCardClick,
  };

  it('renders the MiniCocktailCard with correct information', () => {
    render(<MiniCocktailCard {...cocktailProps} />);

    expect(screen.getByText('Mojito')).toBeInTheDocument();
    expect(screen.getByText('(4)')).toBeInTheDocument();
  });

  it('calls handleCardClick when the card is clicked', () => {
    render(<MiniCocktailCard {...cocktailProps} />);

    fireEvent.click(screen.getByText('Mojito'));

    expect(handleCardClick).toHaveBeenCalledWith('Mojito');
  });

  it('calls handleAddFavorite when favorite button is clicked and isFavored is false', () => {
    render(<MiniCocktailCard {...cocktailProps} />);

    fireEvent.click(screen.getByTestId('FavoriteBorderIcon'));

    expect(handleAddFavorite).toHaveBeenCalledWith('Mojito');
  });

  it('calls handleRemoveFavorite when favorite button is clicked and isFavored is true', () => {
    const props = { ...cocktailProps, isFavored: true };

    render(<MiniCocktailCard {...props} />);

    fireEvent.click(screen.getByTestId('FavoriteIcon'));

    expect(handleRemoveFavorite).toHaveBeenCalledWith('Mojito');
  });
});
