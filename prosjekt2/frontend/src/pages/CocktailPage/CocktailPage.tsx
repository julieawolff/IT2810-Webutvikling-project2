import { CircularProgress, Container, Typography, useTheme } from '@mui/material';
import './CocktailPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import IngredientsList from '../../components/IngredientsList/IngredientsList';
import InstructionList from '../../components/InstructionList/InstructionList';
import CommentSection from '../../components/CommentSection/CommentSection';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StandardButton from '../../components/StandardButton/StandardButton';
import { useQuery } from '@apollo/client';
import { QUERY_COCKTAIL_PAGE } from '../../api/Queries.tsx';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useEffect, useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites.tsx';
import RatingOnCard from '../../components/RatingOnCard/RatingOnCard.tsx';

/**
 * CocktailPage Component
 * Displays a single cocktail with its average rating, ingredients, instructions and comments
 * Allows the user to favorite and review the cocktail
 */
function CocktailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [favorited, setFavorited] = useState(false);

  const name = params.name;

  const { loading, error, data } = useQuery(QUERY_COCKTAIL_PAGE, {
    variables: {
      cocktailName: name,
    },
  });

  const cocktail = data?.cocktailByName[0];

  // Set favorited state based on favorites
  useEffect(() => {
    if (cocktail) {
      setFavorited(favorites.includes(cocktail.name));
    }
  }, [cocktail, favorites]);

  // Scroll to top on render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <CircularProgress color="inherit" size={16} />;
  }

  if (!cocktail || error) {
    return <ErrorComponent />;
  }

  // Toggle favorite status of cocktail
  const handleFavoriteToggle = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    setFavorited((prev) => {
      const newFavorited = !prev;
      if (newFavorited) {
        addFavorite(cocktail.name);
      } else {
        removeFavorite(cocktail.name);
      }
      return newFavorited;
    });
  };

  return (
    <Container aria-labelledby="cocktail-title">
      <StandardButton
        text="Go back"
        startIcon={<ArrowBackIcon sx={{ color: theme.palette.primary.contrastText }} />}
        onClick={() => navigate(-1)}
        color={theme.palette.primary.light}
        aria-label="Go back to the previous page"
      />
      <Typography
        id="cocktail-title"
        className="cocktail-title-and-heart"
        variant="h2"
        sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
      >
        {cocktail.name}
        {favorited ? (
          <FavoriteIcon 
            className="icon" 
            onClick={handleFavoriteToggle} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleFavoriteToggle(e);
              }
            }}
            tabIndex={0}
            aria-label="Favorite - Click to unfavorite"
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
            tabIndex={0} 
            aria-label="Not favorite - Click to favorite"
          />
        )}
        <RatingOnCard rating={cocktail.ratingSum} />
      </Typography>
      <Container
        className="image-and-ingredients-list"
        sx={{ backgroundColor: theme.palette.secondary.dark }}
        aria-labelledby="ingredients-section"
        tabIndex={0}
      >
        <img className="cocktail-image" src={cocktail.image} alt={`Image of ${cocktail.name}`} />

        <IngredientsList
          ingredients={
            cocktail.ingredientsConnection?.edges?.map(
              (edge: { node: { name: string }; properties: { measure: string } }) => ({
                name: edge.node.name,
                measure: edge.properties.measure,
              }),
            ) || []
          }
        />
      </Container>
      {cocktail.instructions ? (
        <InstructionList instructions={cocktail.instructions} />
      ) : (
        <p style={{ color: theme.palette.primary.light }}>No instructions available.</p>
      )}

      <CommentSection cocktailName={name} />
    </Container>
  );
}

export default CocktailPage;
