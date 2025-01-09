import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Cocktail } from './types';

type ApolloProviderProps = {
  children: React.ReactNode;
};

// Custom merge function for the Apollo cache to merge incoming data with existing data in the cache
const mergeCocktails = (existing = [], incoming: Cocktail[]) => {
  return [...existing, ...incoming];
};

// Initialize Apollo Client with the cache configuration
const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          cocktails: {
            merge: mergeCocktails,
          },
        },
      },
    },
  }),
});

/**
 * ApolloProvider wrapper
 * A wrapper component for the ApolloProvider to provide the Apollo client to the application
 */
const ApolloWrapper: React.FC<ApolloProviderProps> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;
