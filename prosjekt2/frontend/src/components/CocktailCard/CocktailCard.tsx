import { Box, Card, Container, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './CocktailCard.css';
import { useState } from 'react';
import RatingOnCard from '../RatingOnCard/RatingOnCard';

interface CocktailCardProps {
  name: string;
  image: string;
  isFavored: boolean;
  rating: number;
  indexForTest: string;
  handleRemoveFavorite: (cocktailName: string) => void;
  handleAddFavorite: (cocktailName: string) => void;
  handleCardClick: (cocktailName: string) => void;
}

/**
 * CocktailCard Component
 * Displays name, image, rating and favorite icon for a cocktail
 * Navigatates to cocktail page of the given cocktail when clicking on the card
 */
function CocktailCard({
  name,
  image,
  isFavored,
  rating,
  indexForTest,
  handleRemoveFavorite,
  handleAddFavorite,
  handleCardClick,
}: CocktailCardProps) {
  const [favorited, setFavourited] = useState(isFavored);


   // Toggles favorite status of cocktail
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
    <article
      onClick={() => handleCardClick(name)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(name);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${name}, rated ${rating}`}
    >
      <Card
        className="cocktail-card"
        data-testid={indexForTest}
        sx={{ boxShadow: 4, backgroundColor: (theme) => theme.palette.secondary.dark }}
      >
        <Box className="rating-box">
          <RatingOnCard rating={rating} />
        </Box>
        <img className="image" src={image} alt={'Picture of ' + name} />

        <Container className="text-and-icon-container">
          <Typography align="left" sx={{ fontSize: '1.3rem' }}>
            {name}
          </Typography>

          {favorited ? (
            <FavoriteIcon
              className="icon"
              role="button"
              aria-label="Favourited. Click to remove from favorites."
              tabIndex={0}
              onClick={handleFavoriteToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleFavoriteToggle(e);
                }
              }}
              sx={{ color: (theme) => theme.palette.primary.light, width: '2rem' }}
            />
          ) : (
            <FavoriteBorderIcon
              className="icon"
              role="button"
              aria-label="Not favourited. Click to add to favorites."
              tabIndex={0}
              onClick={handleFavoriteToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleFavoriteToggle(e);
                }
              }}
              sx={{ color: (theme) => theme.palette.primary.light, width: '2rem' }}
            />
          )}
        </Container>
      </Card>
    </article>
  );
}

export default CocktailCard;
