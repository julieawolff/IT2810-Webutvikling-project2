import { useQuery } from '@apollo/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { QUERY_USER_FAVORITES } from '../api/Queries';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../api/Mutations';
import { useMutation } from '@apollo/client';
import { useUsername } from './useUsername';
import { Cocktail } from '../api/types';

interface FavoritesContextProps {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
}

type FavoriteContextProviderProps = {
  children: React.ReactNode;
};

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

/**
 * Favorites Provider
 * A provider for the favorites context, since this is accessed by multiple components
 * Fetches the initial favorites for the user and provides functions to add and remove favorites
 */
export const FavoritesProvider: React.FC<FavoriteContextProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addMutationFavorite] = useMutation(ADD_FAVORITE);
  const [removeMutationFavorite] = useMutation(REMOVE_FAVORITE);
  const username = useUsername();

  // Fetch the initial favorites
  const { data, refetch } = useQuery(QUERY_USER_FAVORITES, {
    variables: { username },
    skip: !username,
  });

  useEffect(() => {
    if (data && data.cocktailsFavoredByUser) {
      setFavorites(data.cocktailsFavoredByUser.map((cocktail: Cocktail) => cocktail.name));
    }
  }, [data]);

  // Function to add a favorite
  const addFavorite = async (cocktailName: string) => {
    try {
      await addMutationFavorite({
        variables: { username: localStorage.getItem('username'), cocktailName },
      });
      refetch();
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  // Function to remove a favorite
  const removeFavorite = async (cocktailName: string) => {
    try {
      await removeMutationFavorite({ variables: { username, cocktailName } });
      refetch();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>{children}</FavoritesContext.Provider>
  );
};
