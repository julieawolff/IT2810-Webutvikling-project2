import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import UserStartPage from './pages/UserStartPage/UserStartPage';
import CocktailPage from './pages/CocktailPage/CocktailPage';
import { useEffect } from 'react';
import { useUsername } from './hooks/useUsername';
import Navbar from './components/Navbar/Navbar';
import { Box, createTheme, GlobalStyles, ThemeProvider } from '@mui/material';
import UserPage from './pages/UserPage/UserPage';
import LandingPage from './pages/LandingPage/LandingPage';
import MainPage from './pages/MainPage/MainPage';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from './assets/theme';
import { RootState } from './redux/store.ts';

function App() {
  const username = useUsername();
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = createTheme(isDarkMode ? darkTheme : lightTheme);

  useEffect(() => {
    if (username && window.location.pathname === '/project2/') {
      navigate('/');
    }
  }, [username, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <div className="app" style={{ backgroundColor: theme.palette.secondary.main }}>
        <GlobalStyles
          styles={{
            body: {
              color: theme.palette.primary.main,
            },
          }}
        />
        {location.pathname !== '/' && <Navbar />}
        <Box sx={{ marginTop: '120px' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<UserStartPage />} />
            <Route path="/home" element={username ? <MainPage /> : <Navigate to="/" />} />
            <Route path="/cocktail/:name" element={username ? <CocktailPage /> : <Navigate to="/" />} />
            <Route path="/user/:name" element={username ? <UserPage /> : <Navigate to="/" />} />
          </Routes>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
