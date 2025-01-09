import { createTheme } from '@mui/material/styles';
/**
 * Define light and dark themes for the application
 */

export const lightTheme = createTheme({
  typography: {
    fontFamily: 'Raleway, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#910F30',
      light: '#D01C49',
      dark: '#910F30',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F0E7D9',
      light: '#F0E7D9',
      dark: '#ECDFCC',
      contrastText: '#000000',
    },
  },
});

export const darkTheme = createTheme({
  typography: {
    fontFamily: 'Raleway, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#f7f7f7',
      light: '#D01C49',
      dark: '#f7f7f7',
      contrastText: '#f7f7f7',
    },
    secondary: {
      main: '#222222',
      dark: '#333333',
      contrastText: '#c7c7c7',
    },
  },
});
