import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';

const Login = () => {
  const [identifier, setIdentifier] = useState('');  // 'identifier' can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make the login API request to the backend
      console.log("Sending request with", { email: identifier, password });
      const response = await axios.post('http://localhost:5000/api/v1/users/login', {
        email: identifier,  // Backend handles both email and username
        password
      }, {
        withCredentials: true // To send cookies along with the request
      });

      console.log('Login successful:', response.data);
      navigate('/dashboard'); // Navigate to the dashboard or home page

    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3, border: 1, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>

      <form onSubmit={handleLogin}>
        <Grid container spacing={2}>
          <Grid item>
            <TextField
              fullWidth
              label="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>

          {error && (
            <Grid item>
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            </Grid>
          )}

          <Grid item>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ padding: '12px' }}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Login;
