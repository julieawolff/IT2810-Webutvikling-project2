import { CircularProgress, Container, ImageList, Typography } from '@mui/material';
import './FavoriteTable.css';
import { useState } from 'react';
import { QUERY_USER_FAVORITES } from '../../api/Queries';
import { Cocktail } from '../../api/types';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import { useFavorites } from '../../hooks/useFavorites.tsx';
import MiniCocktailCard from '../MiniCocktailCard/MiniCocktailCard.tsx';

interface FavoriteTableProps {
  userName: string | undefined;
}

/**
 * FavoriteTable Component
 * Displays a sideways scrollable list of the user's favorite cocktails through MiniCocktailCard
 * Renders "You don't have any favorites 🥹" if the user has no favorites yet
 */
function FavoriteTable({ userName }: FavoriteTableProps) {
  const [favorites, setFavorites] = useState<Cocktail[]>([]);
  const [username] = useState(userName);
  const { addFavorite, removeFavorite } = useFavorites();

  const navigate = useNavigate();

  const { loading, error } = useQuery(QUERY_USER_FAVORITES, {
    variables: { username },
    onCompleted: (data) => {
      if (data) {
        setFavorites(data.cocktailsFavoredByUser);
      }
    },
  });

  if (loading) return <CircularProgress color="inherit" size={16} />;
  if (error) return <ErrorComponent />;

  const handleCardClick = (cocktailName: string) => {
    navigate(`/cocktail/${cocktailName}`);
  };

  return (
    <Container className="table" disableGutters={true}>
      <Typography variant="h4" sx={{ fontWeight: 510 }}>
        Your favorites
      </Typography>
      <ImageList
        className="cocktail-section"
        cols={favorites.length === 0 ? 1 : Math.max(favorites.length, 4)}
        sx={{ maxWidth: '1500px' }}
        aria-label="List of favorite cocktails"
      >
        {favorites.length === 0 ? (
          <Typography className="no-favorites-text" variant="body1" padding="2px" aria-live="polite">
            You don't have any favorites 🥹
          </Typography>
        ) : (
          favorites.map((drink: Cocktail) => (
            <div className="mini-cocktail-card" key={drink.name}>
              <MiniCocktailCard
                key={drink.name}
                name={drink.name}
                image={drink.image}
                isFavored={favorites.includes(drink)}
                rating={drink.ratingSum}
                handleAddFavorite={addFavorite}
                handleRemoveFavorite={removeFavorite}
                handleCardClick={handleCardClick}
              />
            </div>
          ))
        )}
      </ImageList>
    </Container>
  );
}
export default FavoriteTable;
