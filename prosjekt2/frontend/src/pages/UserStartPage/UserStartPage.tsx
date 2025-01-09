import { Container, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import StandardButton from '../../components/StandardButton/StandardButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './UserStartPage.css';
import logo from '../../assets/cocktail_logo.avif';
import darklogo from '../../assets/dark_cocktail_logo.avif';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';
import { useNavigate } from 'react-router-dom';
import { CREATE_USER } from '../../api/Mutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_USER_BY_NAME } from '../../api/Queries';

/**
 * UserStartPage Component
 * Displays the page where the user can create a username to get started
 */
function UserStartPage() {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [createUser] = useMutation(CREATE_USER);
  const [checkUsername] = useLazyQuery(QUERY_USER_BY_NAME);
  const theme = useTheme();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  // Update the username state and validate it
  function updateUsername(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setUsername(value);

    if (value.trim() === '') {
      setError('Username cannot be empty');
    } else if (value.length > 20) {
      setError('Username cannot exceed 20 characters');
    } else {
      setError(null);
    }
  }

  // Handle the submit button click, validate the username and create the user if validation passes
  async function handleSubmit() {
    if (!username || username.trim() === '') {
      setError('Username cannot be empty');
      return;
    }
    if (username.length > 20) {
      setError('Username cannot exceed 20 characters');
      return;
    }

    try {
      const { data } = await checkUsername({ variables: { name: username } });

      if (data.users.length > 0) {
        setError('Username is already taken');
        return;
      }

      await createUser({ variables: { name: username } });
      localStorage.setItem('username', username);
      navigate('/home');
    } catch (err) {
      console.error('Error creating user:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <Container className="outer-container">
      <Typography className="welcome-text"> Welcome to Shaken & Stirred!🥂 </Typography>
      <div className="username-creation">
        <img className="cocktail-photo" src={!isDarkMode ? logo : darklogo} alt="logo" />
        <div className="username-input">
          <Typography variant="h5"> Create a username to get started: </Typography>
          <AccountCircleIcon className="account-icon" sx={{ color: theme.palette.primary.light }} />
          <TextField
            id="outlined-basic"
            placeholder="Type a username here"
            label="Username"
            error={!!error}
            helperText={error}
            onChange={updateUsername}
            sx={{ marginBottom: '20px' }}
          />
          <StandardButton text="Continue" onClick={handleSubmit} />
        </div>
      </div>
    </Container>
  );
}

export default UserStartPage;
