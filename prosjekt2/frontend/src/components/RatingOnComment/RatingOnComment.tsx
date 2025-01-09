import { Box, Rating, Typography } from '@mui/material';

type RatingOnCommentProps = {
  size?: 'small' | 'medium' | 'large';
  onChange?: (newValue: number | null) => void;
  labelText?: string;
  value: number | null;
};

/**
 * RatingOnComment Component
 * Displays 5 stars for rating, and allows user to provide a rating from 1 to 5 stars
 */
function RatingOnComment({ onChange, size, labelText, value }: RatingOnCommentProps) {
  return (
    <Box>
      <Typography id="rating-label">{labelText}</Typography>

      <Rating
        data-testid="rating"
        name="simple-controlled"
        size={size}
        value={value}
        onChange={(event, newValue) => {
          if (onChange) onChange(newValue);
          console.log(event);
        }}
        aria-labelledby="rating-label"
      />
    </Box>
  );
}
export default RatingOnComment;
