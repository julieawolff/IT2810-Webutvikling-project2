import './MainPage.css';
import { debounce } from 'lodash';
import Divider from '@mui/material/Divider';
import CocktailCard from '../../components/CocktailCard/CocktailCard.tsx';
import FilterAndSearch from '../../components/FilterAndSearch/FilterAndSearch.tsx';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_COCKTAILS } from '../../api/Queries.tsx';
import { Cocktail } from '../../api/types.ts';
import { useEffect } from 'react';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent.tsx';
import { useFavorites } from '../../hooks/useFavorites.tsx';
import { Box, Typography } from '@mui/material';
import { useUsername } from '../../hooks/useUsername.ts';

/**
 * MainPage Component
 * Displays the main page of the application with a grid of cocktails
 * Contains components for filtering, sorting and search functionality
 * Uses pagination/infinite scroll to load more cocktails as the user scrolls
 */
function MainPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string[]>(
    sessionStorage.getItem('filter') ? JSON.parse(sessionStorage.getItem('filter') as string) : [],
  );
  const [sort, setSort] = useState(sessionStorage.getItem('sort') || 'Rating High-Low');
  const [offset, setOffset] = useState(0);
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [searchPrefix, setSearchPrefix] = useState('');
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const username = useUsername();

  // Fetch cocktails based on filter, sort, search and pagination offset
  const { loading, error, data } = useQuery(QUERY_COCKTAILS, {
    variables: { limit: 8, offset, filter, sort, searchPrefix },
    onCompleted: (data) => {
      setCocktails((prev) => [...prev, ...data.cocktailsForMainPage]);
    },
  });

  const totalCocktailsCount = data?.totalCocktailsCount || 0;

  // Handle filtering based on user selection
  const handleFiltering = (filterOption: string[]) => {
    if (filter !== filterOption) {
      sessionStorage.setItem('filter', JSON.stringify(filterOption));
      setFilter(filterOption);
      setCocktails([]);
      setOffset(0);
    }
  };

  // Handle sorting based on user selection
  const handleSorting = (sortOption: string) => {
    if (sort !== sortOption) {
      sessionStorage.setItem('sort', sortOption);
      setSort(sortOption);
      setCocktails([]);
      setOffset(0);
    }
  };

  const handleCardClick = (cocktailName: string) => {
    navigate(`/cocktail/${cocktailName}`);
  };

  // Debounce on search input to avoid unnecessary queries
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchPrefix(query);
      setCocktails([]);
      setOffset(0);
    }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle search based on user input
  const handleSearch = (searchString: string) => {
    debouncedSearch(searchString);
  };

  // Infinite scroll to load more cocktails
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight &&
        !loading &&
        cocktails.length < totalCocktailsCount
      ) {
        setOffset((prevOffset) => prevOffset + 8);
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, cocktails.length, totalCocktailsCount]);

  if (!loading && error) return <ErrorComponent />;

  return (
    <main>
      <Typography className="welcome-text" sx={{ color: (theme) => theme.palette.primary.main }}>
        {' '}
        Good to see you {username}, what are you in the mood for today?✨{' '}
      </Typography>
      {loading && !totalCocktailsCount ? (
        <Typography className="cocktail-number-text"> Loading... </Typography>
      ) : (
        <Typography className="cocktail-number-text" aria-live="assertive" role="status">
          {' '}
          {totalCocktailsCount + '  cocktails showing'}{' '}
        </Typography>
      )}
      <Divider></Divider>
      <FilterAndSearch
        handleFiltering={handleFiltering}
        handleSorting={handleSorting}
        handleSearch={handleSearch}
        initialFilter={filter}
        initialSort={sort}
      />
      {cocktails.length === 0 && !loading && (
        <Typography variant="h6" className="no-results-text">
          {' '}
          0 results - No cocktails matching your search{' '}
        </Typography>
      )}
      <Box className="cocktail-grid" role="region" aria-label="List of cocktails">
        {cocktails.map((drink: Cocktail, index: number) => (
          <CocktailCard
            key={drink.name}
            indexForTest={`card-${index}`}
            name={drink.name}
            image={drink.image}
            isFavored={favorites.includes(drink.name)}
            rating={drink.ratingSum}
            handleAddFavorite={addFavorite}
            handleRemoveFavorite={removeFavorite}
            handleCardClick={handleCardClick}
          />
        ))}
      </Box>
      <Box role="status" className="scroll-message" sx={{ textAlign: 'center', marginTop: '1em' }}>
        {loading
          ? 'Loading results...'
          : cocktails.length < totalCocktailsCount
            ? 'Scroll for more results.'
            : 'All cocktails loaded.'}
      </Box>
    </main>
  );
}

export default MainPage;
