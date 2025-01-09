import { render, screen, fireEvent } from '@testing-library/react';
import LongMenu from './LongMenu';
import { vi } from 'vitest';

const options = ['Option A', 'Option B', 'Option C'];
const name = 'Test Menu';

describe('LongMenu Component', () => {
  const handleChangeMock = vi.fn();

  const setup = (initialOption = '') =>
    render(<LongMenu name={name} options={options} handleChange={handleChangeMock} initialOption={initialOption} />);

  it('renders correctly with label and options', () => {
    setup();
    expect(screen.getByLabelText(name)).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText(name));

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('displays the initial selection correctly', () => {
    setup('Option A');
    expect(screen.getByLabelText(name)).toHaveTextContent('Option A');
  });

  it('calls handleChange with correct value when a new option is selected', () => {
    setup();

    fireEvent.mouseDown(screen.getByLabelText(name));

    fireEvent.click(screen.getByText('Option B'));
    expect(handleChangeMock).toHaveBeenCalledWith('Option B');
  });

  it('updates selected option visually when a new option is selected', () => {
    setup();

    fireEvent.mouseDown(screen.getByLabelText(name));

    fireEvent.click(screen.getByText('Option C'));

    const selectElement = screen.getByRole('combobox', { name: /Test Menu/i });
    expect(selectElement).toHaveTextContent('Option C');
  });
});
