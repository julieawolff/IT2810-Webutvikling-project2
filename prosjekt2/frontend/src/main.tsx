import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import ApolloWrapper from './api/ApolloProvider.tsx';
import { FavoritesProvider } from './hooks/useFavorites.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloWrapper>
      <BrowserRouter basename="/project2">
        <FavoritesProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </FavoritesProvider>
      </BrowserRouter>
    </ApolloWrapper>
  </StrictMode>,
);
