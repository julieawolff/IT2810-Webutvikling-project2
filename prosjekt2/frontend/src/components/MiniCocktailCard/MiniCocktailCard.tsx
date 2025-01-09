import { Box, Card, Container, Typography, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './MiniCocktailCard.css';
import { useState } from 'react';
import RatingOnCard from '../RatingOnCard/RatingOnCard';

interface MiniCocktailCardProps {
  name: string;
  image: string;
  isFavored: boolean;
  rating: number;
  handleRemoveFavorite: (cocktailName: string) => void;
  handleAddFavorite: (cocktailName: string) => void;
  handleCardClick: (cocktailName: string) => void;
}

/**
 * MiniCocktailCard Component
 * Displays name, image, rating and favorite icon for a cocktail
 * Navigatates to cocktail page of the given cocktail when clicking on the card
 */
function MiniCocktailCard({
  name,
  image,
  isFavored,
  rating,
  handleRemoveFavorite,
  handleAddFavorite,
  handleCardClick,
}: MiniCocktailCardProps) {
  const [favorited, setFavourited] = useState(isFavored);
  const theme = useTheme();

  const handleFavoriteToggle = async (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    try {
      setFavourited(!favorited);

      if (favorited === false)
        handleAddFavorite(name); //
      else handleRemoveFavorite(name);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Box 
      onClick={() => handleCardClick(name)} 
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(name);
        }
      }}
      aria-label={`${name}, rated ${rating}`} 
      tabIndex={0} role="button"
      >
      <Card className="cocktail-card" sx={{ boxShadow: 4, backgroundColor: theme.palette.secondary.dark }}>
        <Box className="rating-box">
          <RatingOnCard rating={rating} />
        </Box>
        <img className="mini-image" src={image} alt={'Picture of ' + name} />

        <Container className="text-and-icon-container">
          <Typography variant="h6" align="left" sx={{ p: 1 }}>
            {name}
          </Typography>

          {favorited ? (
            <FavoriteIcon
              className="icon"
              onClick={handleFavoriteToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleFavoriteToggle(e);
                }
              }}
              sx={{ color: theme.palette.primary.light, width: '2rem' }}
              aria-label={`Unfavorite ${name}`}
              aria-pressed={favorited}
              tabIndex={0}
              role="button"
            />
          ) : (
            <FavoriteBorderIcon
              className="icon"
              onClick={handleFavoriteToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleFavoriteToggle(e);
                }
              }}
              sx={{ color: theme.palette.primary.light, width: '2rem' }}
              aria-label={`Favorite ${name}`}
              aria-pressed={favorited}
              tabIndex={0}
              role="button"
            />
          )}
        </Container>
      </Card>
    </Box>
  );
}

export default MiniCocktailCard;
