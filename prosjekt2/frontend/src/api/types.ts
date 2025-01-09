/**
 * Defines types used in the application
 */

export type Cocktail = {
  id: string;
  name: string;
  tags: string;
  category: string;
  ibas: string;
  alcoholic: string;
  glass: string;
  instruction: string;
  image: string;
  ratingSum: number;
  ingredients: Ingredient[];
  favoritedBy: User[];
  commentedBy: User[];
};

export type Ingredient = {
  name: string;
  measure: string;
  drinks: Cocktail[];
};

export type User = {
  name: string;
  favorites: Cocktail[];
  comments: Cocktail[];
};

export type UserComment = {
  rating: number;
  description: string;
  username: string;
  cocktail: string;
};
