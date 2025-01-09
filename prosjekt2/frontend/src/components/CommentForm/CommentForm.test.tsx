import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import CommentForm from './CommentForm';
import { useMutation } from '@apollo/client';
import { useUsername } from '../../hooks/useUsername';

vi.mock('@apollo/client', () => ({
  gql: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('../../hooks/useUsername', () => ({
  useUsername: vi.fn(),
}));

describe('CommentForm', () => {
  const mockUpdateComment = vi.fn();
  const mockUsername = 'testuser';

  beforeEach(() => {
    (useUsername as Mock).mockReturnValue(mockUsername);
    (useMutation as Mock).mockReturnValue([vi.fn().mockResolvedValue({ data: {} })]);

    mockUpdateComment.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should render CommentForm with inputs and button', () => {
    render(<CommentForm cocktailName="Mojito" updateComment={mockUpdateComment} />);

    expect(screen.getByText('Leave a review')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your thoughts on this cocktail?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/ })).toBeInTheDocument();
  });

  it('should submit the form with comment and rating', async () => {
    render(<CommentForm cocktailName="Mojito" updateComment={mockUpdateComment} />);
    const commentInput = screen.getByPlaceholderText('Your thoughts on this cocktail?');

    fireEvent.change(commentInput, { target: { value: 'Nice cocktail!' } });
    const stars = screen.getAllByTestId('StarBorderIcon');
    fireEvent.click(stars[2]);
    fireEvent.click(screen.getByRole('button', { name: /Submit/ }));

    await waitFor(() => {
      expect(useMutation).toHaveBeenCalledTimes(5);
      expect(mockUpdateComment).toHaveBeenCalledTimes(1);
    });
  });

  it('should not submit the form if comment or rating is missing', async () => {
    render(<CommentForm cocktailName="Mojito" updateComment={mockUpdateComment} />);

    fireEvent.click(screen.getByRole('button', { name: /Submit/ }));

    await waitFor(() => {
      expect(useMutation).toHaveBeenCalledTimes(2);
      expect(mockUpdateComment).toHaveBeenCalledTimes(0);
    });
  });
});
