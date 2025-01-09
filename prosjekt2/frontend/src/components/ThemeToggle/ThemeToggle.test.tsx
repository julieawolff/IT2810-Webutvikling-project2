import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import ThemeToggle from './ThemeToggle';

const createMockStore = (isDarkMode: boolean) => {
  const themeSlice = createSlice({
    name: 'theme',
    initialState: { isDarkMode },
    reducers: {
      toggleTheme: (state) => {
        state.isDarkMode = !state.isDarkMode;
      },
    },
  });

  return configureStore({
    reducer: {
      theme: themeSlice.reducer,
    },
  });
};

describe('ThemeToggle Component', () => {
  it('renders light and dark mode icons', () => {
    const store = createMockStore(false);
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>,
    );

    expect(screen.getByTestId('WbSunnyIcon')).toBeInTheDocument();
    expect(screen.getByTestId('DarkModeIcon')).toBeInTheDocument();
  });

  it('renders the Switch with the correct initial state', () => {
    const store = createMockStore(false);
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>,
    );

    const switchButton = screen.getByRole('checkbox');
    expect(switchButton).not.toBeChecked();
  });

  it('dispatches toggleTheme action when Switch is clicked', () => {
    const store = createMockStore(false);
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>,
    );

    const switchButton = screen.getByRole('checkbox');
    fireEvent.click(switchButton);

    const actions = store.getState().theme.isDarkMode;
    expect(actions).toBeTruthy();
  });

  it('Switch reflects dark mode when isDarkMode is true', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>,
    );

    const switchButton = screen.getByRole('checkbox');
    expect(switchButton).toBeChecked();
  });
});
