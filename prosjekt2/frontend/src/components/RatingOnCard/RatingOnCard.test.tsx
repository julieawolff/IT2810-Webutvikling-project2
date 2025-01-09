import { render, screen } from '@testing-library/react';
import RatingOnCard from './RatingOnCard';

describe('RatingOnCard', () => {
  it('renders the star icon and the rating value', () => {
    const rating = 4;

    render(<RatingOnCard rating={rating} />);

    const starIcon = screen.getByTestId('StarIcon');
    expect(starIcon).toBeInTheDocument();

    const ratingText = screen.getByText(`(${rating})`);
    expect(ratingText).toBeInTheDocument();
  });

  it('displays the correct rating value dynamically', () => {
    const rating = 5;

    render(<RatingOnCard rating={rating} />);

    const ratingText = screen.getByText(`(${rating})`);
    expect(ratingText).toBeInTheDocument();
  });
});
