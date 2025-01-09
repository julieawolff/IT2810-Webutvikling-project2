import StarIcon from '@mui/icons-material/Star';
import { Box, Typography, useTheme } from '@mui/material';

type RatingOnCardProps = {
  rating: number;
};

/**
 * RatingOnCard Component
 * Displays rating number along with a star icon for a cocktail
 * Format: ★ (Rating)
 */
function RatingOnCard({ rating }: RatingOnCardProps) {
  const theme = useTheme();

  return (
    <Box className="rating-box" aria-label={`Rating: ${rating} out of 5 stars`}>
      <StarIcon sx={{ color: theme.palette.primary.light }} />
      <Typography data-testid="rating-number" variant="body2">
        {' (' + rating + ') '}
      </Typography>
    </Box>
  );
}

export default RatingOnCard;
