import ErrorComponent from './ErrorComponent';
import { render, screen } from '@testing-library/react';

describe('ErrorComponent', () => {
  it('renders correctly', () => {
    render(<ErrorComponent />);
    expect(screen.getByText('Error loading resource')).toBeInTheDocument();
  });
});
