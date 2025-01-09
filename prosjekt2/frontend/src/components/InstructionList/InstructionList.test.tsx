import { render, screen } from '@testing-library/react';
import InstructionList from './InstructionList';

describe('InstructionList', () => {
  const instructions = 'Step 1: Shake the cocktail. Step 2: Pour into a glass. Step 3: Garnish and serve.';

  it('renders the InstructionsList component with instructions', () => {
    render(<InstructionList instructions={instructions} />);

    expect(screen.getByText('Instructions')).toBeInTheDocument();

    const instructionsList = instructions.split('.').filter((sentence) => sentence.trim() !== '');

    instructionsList.forEach((instruction) => {
      expect(screen.getByText(instruction.trim())).toBeInTheDocument();
    });
  });

  it('renders a list item for each instruction', () => {
    render(<InstructionList instructions={instructions} />);

    const listItems = screen.getAllByRole('listitem');

    const instructionsList = instructions.split('.').filter((sentence) => sentence.trim() !== '');

    expect(listItems.length).toBe(instructionsList.length);
  });

  it('handles empty instruction string in a good way', () => {
    render(<InstructionList instructions="" />);
    expect(screen.getByText('Instructions')).toBeInTheDocument();

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);
  });
});
