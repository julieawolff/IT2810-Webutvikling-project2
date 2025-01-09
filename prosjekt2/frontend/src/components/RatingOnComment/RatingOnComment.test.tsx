import { render, screen } from '@testing-library/react';
import RatingOnComment from './RatingOnComment';

describe('RatingOnComment', () => {
  it('renders label text if provided', () => {
    const labelText = 'Rate this comment';

    render(<RatingOnComment labelText={labelText} value={3} />);

    const labelElement = screen.getByText(labelText);
    expect(labelElement).toBeInTheDocument();
  });

  it('renders Rating component with the correct value', () => {
    const value = 4;

    render(<RatingOnComment value={value} />);

    // Check if the correct amount of stars are filled/empty
    const filledStars = screen.getAllByTestId('StarIcon');
    const emptyStars = screen.getAllByTestId('StarBorderIcon');

    expect(filledStars.length).toBe(4);
    expect(emptyStars.length).toBe(1);
  });
  it('renders Rating component with another value', () => {
    const value = 2;

    render(<RatingOnComment value={value} />);

    // Check if the correct amount of stars are filled/empty
    const filledStars = screen.getAllByTestId('StarIcon');
    const emptyStars = screen.getAllByTestId('StarBorderIcon');

    expect(filledStars.length).toBe(2);
    expect(emptyStars.length).toBe(3);
  });
});
