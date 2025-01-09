import { render, screen } from '@testing-library/react';
import IngredientsList from './IngredientsList';

describe('IngredientsList', () => {
  const ingredients = [
    { name: 'Tequila', measure: '50ml' },
    { name: 'Lime Juice', measure: '30ml' },
    { name: 'Triple Sec', measure: '20ml' },
  ];

  it('renders the IngredientsList component with ingredients', () => {
    render(<IngredientsList ingredients={ingredients} />);

    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Ingredient')).toBeInTheDocument();
    expect(screen.getByText('Measure')).toBeInTheDocument();

    ingredients.forEach((ingredient) => {
      expect(screen.getByText(ingredient.name)).toBeInTheDocument();
      expect(screen.getByText(ingredient.measure)).toBeInTheDocument();
    });
  });

  it('displays the correct number of table rows based on ingredients length', () => {
    render(<IngredientsList ingredients={ingredients} />);

    const rows = screen.getAllByRole('row');

    expect(rows.length).toBe(ingredients.length + 1); // +1 for the header row
  });
});
