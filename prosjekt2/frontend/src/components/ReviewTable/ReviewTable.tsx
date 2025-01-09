import { Box, CircularProgress, Container, Divider, List, ListItem, Typography, useTheme } from '@mui/material';
import './ReviewTable.css';
import { QUERY_USER_REVIEWS } from '../../api/Queries';
import { useMutation, useQuery } from '@apollo/client';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import { UserComment } from '../../api/types';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { DELETE_REVIEW } from '../../api/Mutations';
import StandardButton from '../StandardButton/StandardButton';

interface ReviewTableProps {
  userName: string | undefined;
  cocktailName: string;
}

/**
 * ReviewTable Component
 * Displays a list of the user's reviews (cocktail name, comment and rating) with the option to delete them
 * Navigatates to cocktail page of the given cocktail when clicking on the cocktail name
 * Renders "No reviews available." if the user has no reviews
 */
function ReviewTable({ userName }: ReviewTableProps) {
  const [deleteReview] = useMutation(DELETE_REVIEW);
  const navigate = useNavigate();
  const theme = useTheme();

  const { loading, error, data, refetch } = useQuery(QUERY_USER_REVIEWS, {
    variables: { userName: userName },
  });

  const reviews = data?.reviewsByUser ?? [];
  refetch();

  if (loading) return <CircularProgress color="inherit" size={16} />;
  if (error) return <ErrorComponent />;

  const handleCardClick = (cocktailName: string) => {
    navigate(`/cocktail/${cocktailName}`);
  };

  const handleDelete = async (cocktailName: string) => {
    try {
      await deleteReview({
        variables: {
          username: userName,
          cocktailName,
        },
      });
      refetch();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <Container className="table" disableGutters={true}>
      <Typography variant="h4" sx={{ fontWeight: 510 }}>
        Your reviews
      </Typography>
      <Box
        className="section-box"
        sx={{ backgroundColor: theme.palette.secondary.dark }}
        aria-label="User reviews section"
      >
        {reviews.length === 0 ? (
          <Typography variant="body1" padding="2px">
            No reviews available.
          </Typography>
        ) : (
          <List className="review-section-list">
            {reviews.map((review: UserComment, index: number) => (
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
                className="review-section-item"
                key={index}
              >
                <Box
                  onClick={() => handleCardClick(review.cocktail)}
                  aria-labelledby={`review-title-${index}`}
                  aria-describedby={`review-description-${index}`}
                  tabIndex={0}
                  role="button"
                >
                  <Typography
                    variant="h6"
                    id={`review-title-${index}`}
                    className="commentSection-username"
                    sx={{ color: theme.palette.primary.dark }}
                  >
                    {review.cocktail}
                  </Typography>
                  <Typography
                    variant="body1"
                    id={`review-description-${index}`}
                    className="commentSection-comment-text"
                    sx={{ color: theme.palette.secondary.contrastText }}
                  >
                    {review.description}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="commentSection-rating"
                    sx={{ color: theme.palette.primary.light }}
                  >
                    Rating: {review.rating}
                  </Typography>
                </Box>
                <Box className="delete-button">
                  <StandardButton
                    text="Delete"
                    startIcon={<DeleteIcon />}
                    color={theme.palette.primary.light}
                    onClick={() => handleDelete(review.cocktail)}
                    width={100}
                    height={30}
                    ariaLabel={`Delete review for ${review.cocktail}`}
                  />
                </Box>
                {index < reviews.length - 1 && (
                  <Divider
                    aria-hidden="true"
                    sx={{ mt: 2, mb: 2, bgcolor: 'rgba(0, 0, 0, 0.1)', alignSelf: 'stretch' }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default ReviewTable;
