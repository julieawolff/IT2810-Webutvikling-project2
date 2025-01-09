import { render, screen, fireEvent } from '@testing-library/react';
import StandardButton from './StandardButton';
import { vi } from 'vitest';

describe('StandardButton Component', () => {
  it('renders with the correct text', () => {
    render(<StandardButton text="Click Me" onClick={() => {}} />);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<StandardButton text="Click Me" onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick handler when disabled', () => {
    const handleClick = vi.fn();
    render(<StandardButton text="Click Me" onClick={handleClick} disabled />);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies the correct width and height', () => {
    render(<StandardButton text="Click Me" onClick={() => {}} width="200px" height="50px" />);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveStyle({ width: '200px', height: '50px' });
  });

  it('renders with the start icon if provided', () => {
    const startIcon = <span data-testid="start-icon">*</span>;
    render(<StandardButton text="Click Me" onClick={() => {}} startIcon={startIcon} />);

    const icon = screen.getByTestId('start-icon');
    expect(icon).toBeInTheDocument();
  });
});
