// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Container,
  Card,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/users/dashboard', {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (err) {
        setError('Failed to fetch user');
        console.error('Error fetching user:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/users/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      setError('Logout failed');
      console.error('Logout error:', err);
    }
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">User Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={handleChangePassword}>
              Change Password
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {error && <Typography color="error">{error}</Typography>}
        {user && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Avatar
              src={user.avatar}
              alt="User Avatar"
              sx={{
                width: 120,
                height: 120,
                margin: 'auto',
                border: '3px solid #1976d2',
                mb: 2,
              }}
            />
            <Typography variant="h5" gutterBottom>
              Welcome, {user.username} 👋
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> {user.role}
            </Typography>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default UserDashboard;
