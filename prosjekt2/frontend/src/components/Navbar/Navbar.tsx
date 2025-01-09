import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/cocktail_logo.avif';
import darklogo from '../../assets/dark_cocktail_logo.avif';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useUsername } from '../../hooks/useUsername';
import './Navbar.css';

/**
 * Navbar Component
 * Displays the application logo and name, user icon and a toggle button for lightmode/darkmode
 */
function Navbar() {
  const navigate = useNavigate();
  const username = useUsername();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <AppBar
      position="absolute"
      sx={{ width: '100vw', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4)' }}
      aria-label="Main navigation bar"
    >
      <Toolbar
        className="toolbar"
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.main,
        }}
      >
        <Box className="logo-container">
          <IconButton
            className="logo-button"
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            aria-label="Go to homepage"
          >
            <img className="logo-image" src={!isDarkMode ? logo : darklogo} alt="logo" />
          </IconButton>
          <Typography
            className="application-name"
            variant="h1"
            sx={{
              color: (theme) => theme.palette.primary.main,
            }}
          >
            Shaken & Stirred
          </Typography>
        </Box>
        {username && (
          <Box className="user-icon-container">
            <ThemeToggle />
            <IconButton
              aria-label={`Navigate to user page`}
              className="user-icon-button"
              edge="start"
              color="inherit"
              onClick={() => navigate(`/user/${username}`)}
            >
              <AccountCircleIcon
                className="user-icon"
                sx={{
                  color: (theme) => theme.palette.primary.main,
                }}
              />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
