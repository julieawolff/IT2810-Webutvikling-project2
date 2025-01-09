import { gql } from '@apollo/client';

/**
 * Mutations for the application
 * Contains and defines all the mutations used in the application
 * These mutations are used to interact with the backend API to create, update or delete data
 */

export const CREATE_USER = gql`
  mutation CreateUser($name: String!) {
    createUsers(input: { name: $name }) {
      users {
        name
      }
    }
  }
`;

export const UPDATE_USERNAME = gql`
  mutation UpdateUsers($where: UserWhere, $update: UserUpdateInput) {
    updateUsers(where: $where, update: $update) {
      users {
        name
      }
    }
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($username: String!, $cocktailName: String!) {
    addFavorite(userName: $username, cocktailName: $cocktailName) {
      name
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($username: String!, $cocktailName: String!) {
    removeFavorite(userName: $username, cocktailName: $cocktailName) {
      name
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($username: String!, $cocktailName: String!, $rating: Int!, $description: String!) {
    createComment(userName: $username, cocktailName: $cocktailName, rating: $rating, description: $description) {
      name
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($username: String!, $cocktailName: String!) {
    deleteReview(userName: $username, cocktailName: $cocktailName)
  }
`;
