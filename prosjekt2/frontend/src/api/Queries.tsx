import { gql } from '@apollo/client';

/**
 * Queries for the application
 * Contains and defines all the queries used in the application
 * These queries are used to fetch data from the backend API
 */

export const QUERY_COCKTAILS = gql`
  query GetCocktailsForMainPage($limit: Int, $offset: Int, $filter: [String], $sort: String, $searchPrefix: String) {
    cocktailsForMainPage(limit: $limit, offset: $offset, filter: $filter, sort: $sort, searchPrefix: $searchPrefix) {
      name
      image
      alcoholic
      ratingSum
    }

    totalCocktailsCount(filter: $filter, searchPrefix: $searchPrefix)
  }
`;

export const QUERY_COCKTAIL_PAGE = gql`
  query CocktailsByName($cocktailName: String!) {
    cocktailByName(cocktailName: $cocktailName) {
      name
      instructions
      image
      ratingSum
      ingredientsConnection {
        edges {
          properties {
            measure
          }
          node {
            name
          }
        }
      }
    }
  }
`;

export const QUERY_USER_BY_NAME = gql`
  query GetUserByName($name: String!) {
    users(where: { name: $name }) {
      name
    }
  }
`;

export const QUERY_USER_FAVORITES = gql`
  query GetFavoritedCocktails($username: String!) {
    cocktailsFavoredByUser(userName: $username) {
      name
      image
      ratingSum
    }
  }
`;

export const QUERY_COMMENTS_FOR_COCKTAIL = gql`
  query GetCommentsForCocktail($cocktailName: String!) {
    commentsForCocktail(cocktailName: $cocktailName) {
      rating
      description
      username
    }
  }
`;

export const QUERY_USER_REVIEWS = gql`
  query GetReviewsByUser($userName: String!) {
    reviewsByUser(userName: $userName) {
      rating
      description
      cocktail
    }
  }
`;
