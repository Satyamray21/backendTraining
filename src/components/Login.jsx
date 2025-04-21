import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Email or username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/users/login',
        {
          email: identifier,
          password,
        },
        { withCredentials: true }
      );

      console.log('Login successful:', response.data);
      navigate('/dashboard');

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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
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

          <Grid item xs={12} textAlign="right">
            <Typography variant="body2" component={Link} to="/forgot-password" sx={{ textDecoration: 'none', color: 'primary.main', cursor: 'pointer' }}>
              Forgot Password?
            </Typography>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
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
