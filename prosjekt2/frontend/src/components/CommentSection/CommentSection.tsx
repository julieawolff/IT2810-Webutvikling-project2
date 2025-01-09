import { Box, Container, Typography, Divider, CircularProgress, useTheme } from '@mui/material';
import CommentForm from '../CommentForm/CommentForm';
import './CommentSection.css';
import { useQuery } from '@apollo/client';
import { QUERY_COMMENTS_FOR_COCKTAIL } from '../../api/Queries';
import { UserComment } from '../../api/types';
import { useParams } from 'react-router-dom';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import { useEffect, useState } from 'react';

type CommentSectionProps = {
  cocktailName: string | undefined;
};

/**
 * CommentSection Component
 * Displays all comments for a cocktail as well as the CommentForm for adding a new comment
 */
function CommentSection({ cocktailName }: CommentSectionProps) {
  const param = useParams();
  const theme = useTheme();

  const { loading, error, data, refetch } = useQuery(QUERY_COMMENTS_FOR_COCKTAIL, {
    variables: { cocktailName: param.name },
  });
  const [comments, setComments] = useState<UserComment[]>(data?.commentsForCocktail || []);

  useEffect(() => {
    if (data) {
      setComments(data.commentsForCocktail);
    }
  }, [data]);

  const updateComment = () => {
    refetch();
  };

  if (loading) return <CircularProgress color="inherit" size={16} />;
  if (error) return <ErrorComponent />;

  return (
    <Container
      className="comment-section-container"
      sx={{ backgroundColor: theme.palette.secondary.dark }}
      aria-labelledby="comment-section-title"
    >
      <CommentForm cocktailName={cocktailName} updateComment={updateComment} />
      <Box className="comment-section-list" id="comment-section-title">
        {comments.map((comment: UserComment, index: number) => (
          <Box
            key={index}
            sx={{ mb: 2 }}
            aria-label={`Comment by ${comment.username}, rating: ${comment.rating}`}
            tabIndex={0}
          >
            <Typography className="commentSection-username" sx={{ color: theme.palette.primary.dark, fontWeight: 600 }}>
              {comment.username}
            </Typography>
            <Typography
              variant="body1"
              className="commentSection-comment-text"
              sx={{ color: theme.palette.secondary.contrastText, fontWeight: 500 }}
            >
              {comment.description}
            </Typography>
            <Typography variant="body1" className="commentSection-rating" sx={{ color: theme.palette.primary.light }}>
              Rating: {comment.rating}
            </Typography>

            {index < comments.length - 1 && (
              <Divider aria-hidden="true" sx={{ mt: 2, mb: 2, bgcolor: 'rgba(0, 0, 0, 0.1)' }} />
            )}
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default CommentSection;
