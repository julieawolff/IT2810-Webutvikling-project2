import { render, screen, fireEvent } from '@testing-library/react';
import MultipleSelect from './MultipleSelect';
import { vi } from 'vitest';

const options = ['Option 1', 'Option 2', 'Option 3'];
const name = 'Test Select';

describe('MultipleSelect Component', () => {
  const handleChangeMock = vi.fn();

  const setup = (initialOption: string[] = []) =>
    render(
      <MultipleSelect name={name} options={options} handleChange={handleChangeMock} initialOption={initialOption} />,
    );

  it('renders correctly with label and options', () => {
    setup();
    expect(screen.getByLabelText(name)).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText(name));

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('displays the initial selection correctly', () => {
    setup(['Option 1']);
    expect(screen.getByLabelText(name)).toHaveTextContent('Option 1');
  });

  it('calls handleChange with correct value when options are selected/deselected', () => {
    setup();

    fireEvent.mouseDown(screen.getByLabelText(name));

    fireEvent.click(screen.getByText('Option 1'));
    expect(handleChangeMock).toHaveBeenCalledWith(['Option 1']);

    fireEvent.click(screen.getByText('Option 2'));
    expect(handleChangeMock).toHaveBeenCalledWith(['Option 1', 'Option 2']);

    fireEvent.click(screen.getByText('Option 1'));
    expect(handleChangeMock).toHaveBeenCalledWith(['Option 2']);
  });
});
