import { useSelector, useDispatch } from 'react-redux';
import { Box, Switch } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { toggleTheme } from '../../redux/store.ts';
import { RootState, AppDispatch } from '../../redux/store.ts';
import './ThemeToggle.css';

/**
 * ThemeToggle Component
 * Toggles between light and dark theme
 */
function ThemeToggle() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const dispatch = useDispatch<AppDispatch>();

  const handleThemeChange = () => {
    const newTheme = !isDarkMode;
    dispatch(toggleTheme());
    sessionStorage.setItem('isDarkMode', String(newTheme));
  };

  return (
    <Box display="flex" alignItems="center" width={'8em'}>
      <WbSunnyIcon
        sx={{
          color: (theme) => theme.palette.primary.main,
        }}
        className="light-mode-icon"
        aria-hidden="true"
      />
      <Switch
        checked={isDarkMode}
        onChange={handleThemeChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleThemeChange();
          }
        }}
        color="default"
        inputProps={{
          'aria-label': 'Toggle between light and dark themes. Tick for dark theme, untick for light theme.',
          'aria-live': 'polite',
        }}
        sx={{
          '& .MuiSwitch-thumb': {
            backgroundColor: (theme) => theme.palette.primary.main,
          },
        }}
        className="switch"
      />
      <DarkModeIcon
        sx={{
          color: (theme) => theme.palette.primary.main,
        }}
        className="dark-mode-icon"
        aria-hidden="true"
      />
    </Box>
  );
}

export default ThemeToggle;
