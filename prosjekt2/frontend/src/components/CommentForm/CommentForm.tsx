import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import StandardButton from '../StandardButton/StandardButton';
import './CommentForm.css';
import RatingOnComment from '../RatingOnComment/RatingOnComment';
import { CREATE_COMMENT } from '../../api/Mutations';
import { useMutation } from '@apollo/client';
import { useUsername } from '../../hooks/useUsername';
import { useTheme } from '@mui/material/styles';

type CommentFormProps = {
  cocktailName: string | undefined;
  updateComment: () => void;
};

/**
 * CommentForm Component
 * Form for creating a review on a cocktail with star rating and a comment field
 */
const CommentForm = ({ cocktailName, updateComment }: CommentFormProps) => {
  const username = useUsername();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [error, setError] = useState({ comment: '', rating: '' });
  const [createComment] = useMutation(CREATE_COMMENT);
  const theme = useTheme();

  const WORD_LIMIT = 50;

  const handleCommentChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    const value = e.target.value;
    setComment(value);
  };

  const handleRatingChange = (newRating: number | null) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    let hasError = false;

    if (comment === '') {
      setError((prev) => ({ ...prev, comment: 'Please enter your comment.' }));
      hasError = true;
    } else if (comment.length > WORD_LIMIT) {
      setError((prev) => ({ ...prev, comment: `Comment cannot exceed ${WORD_LIMIT} words.` }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, comment: '' }));
    }

    if (rating === null) {
      setError((prev) => ({ ...prev, rating: 'Please provide a star rating.' }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, rating: '' }));
    }

    if (hasError) {
      return;
    }

    try {
      await createComment({
        variables: { username: username, cocktailName: cocktailName, description: comment, rating: rating },
      });
      setComment('');
      setRating(null);
      updateComment();
    } catch (error) {
      console.log('Error creating comment:', error);
    }
  };

  return (
    <Box className="comment-form-container">
      <Box className="rating-and-commentfield">
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Leave a review
        </Typography>
        <RatingOnComment
          labelText="What is your rating of the cocktail?"
          onChange={handleRatingChange}
          size="large"
          value={rating}
        />
        {error.rating && (
          <Typography variant="body2" color="error">
            {error.rating}
          </Typography>
        )}
        <TextField
          className="textfield"
          placeholder="Your thoughts on this cocktail?"
          multiline
          rows={4}
          onChange={handleCommentChange}
          value={comment}
          error={!!error.comment}
        />
        {error.comment && (
          <Typography variant="body2" color="error">
            {error.comment}
          </Typography>
        )}
      </Box>
      <Box className="comment-submit-button">
        <StandardButton text={'Submit'} onClick={handleSubmit} color={theme.palette.primary.light}></StandardButton>
      </Box>
    </Box>
  );
};

export default CommentForm;
