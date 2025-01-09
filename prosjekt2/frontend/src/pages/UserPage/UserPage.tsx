import { useNavigate, useParams } from 'react-router-dom';
import './UserPage.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { Box, CardMedia, IconButton, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import StandardButton from '../../components/StandardButton/StandardButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLazyQuery, useMutation } from '@apollo/client';
import { UPDATE_USERNAME } from '../../api/Mutations';
import { useUsername } from '../../hooks/useUsername';
import { QUERY_USER_BY_NAME } from '../../api/Queries';
import FavoriteTable from '../../components/FavoriteTable/FavoriteTable.tsx';
import ReviewTable from '../../components/ReviewTable/ReviewTable.tsx';

/**
 * UserPage Component
 * Displays the user's profile page with their username, favorite cocktails and reviews
 * Allows the user to edit username and manage their favorites and reviews
 */
function UserPage() {
  const param = useParams<{ name: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const oldUsername = useUsername();
  const [newUsername, setNewUsername] = useState(param.name || '');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [updateUsername] = useMutation(UPDATE_USERNAME);
  const [checkUsernameExists] = useLazyQuery(QUERY_USER_BY_NAME);
  const theme = useTheme();

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length > 20) {
      setError('Username cannot exceed 20 characters');
    } else {
      setError(null);
      setNewUsername(value);
    }
  };

  const handleSave = async () => {
    // Validate the new username (not empty and not already taken)
    if (!newUsername) {
      setError('Username cannot be empty');
      return;
    }

    const { data } = await checkUsernameExists({ variables: { name: newUsername } });

    if (data?.users.length > 0) {
      setError('Username is already taken');
      return;
    }

    // Update the username if validation passes
    try {
      const response = await updateUsername({
        variables: {
          where: { name: oldUsername },
          update: { name: newUsername },
        },
      });
      console.log(response.data.updateUsers.users);
      localStorage.setItem('username', newUsername);
      navigate(`/user/${newUsername}`);
    } catch (error) {
      console.error('Error updating username:', error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <main>
      <Box className="header-and-button">
        <StandardButton
          text="Go back"
          startIcon={<ArrowBackIcon sx={{ color: theme.palette.primary.contrastText }} />}
          onClick={() => navigate(`/home`)}
          color={theme.palette.primary.light}
          aria-label="Go back to the home page"
        />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Welcome, {oldUsername}!
        </Typography>
      </Box>
      <CardMedia className="profile-card">
        <Box className="picture-and-name">
          <AccountCircleIcon
            sx={{
              fontSize: '200px',
              color: theme.palette.primary.light,
              alignItems: 'center',
            }}
            aria-hidden="true"
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              background: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: '10px',
              paddingLeft: '20px',
            }}
            aria-live="polite"
          >
            {isEditing ? (
              <TextField
                value={newUsername}
                onChange={handleInputChange}
                autoFocus
                variant="outlined"
                sx={{
                  fontSize: 'inherit',
                  '& .MuiInputBase-input': {
                    color: 'white', // Text color inside the input field (when editing)
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'white',
                  },
                }}
                helperText={error}
                aria-label="Enter your new username"
              />
            ) : (
              oldUsername
            )}
            <IconButton
              edge="start"
              color="inherit"
              onClick={isEditing ? handleSave : handleEditClick}
              aria-label={isEditing ? 'Save new username' : 'Edit username'}
              sx={{
                color: 'theme.palette.primary.light',
                outline: 'none',
                '&:focus': { outline: 'none' },
                marginLeft: '10px',
              }}
            >
              <EditIcon sx={{ fontSize: '40px' }} />
            </IconButton>
          </Typography>
        </Box>
      </CardMedia>
      <FavoriteTable userName={param.name}></FavoriteTable>
      <ReviewTable userName={param.name} cocktailName={''}></ReviewTable>
    </main>
  );
}

export default UserPage;
