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
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/users/dashboard', {
          withCredentials: true,
        });
        setUser(response.data.data);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/users/logout', {}, {
        withCredentials: true,
      });
      navigate('/login');
    } catch (err) {
      setError('Logout failed');
      console.error('Logout error:', err);
    }
  };

  const handleChangePassword = () => {
    navigate('/change-password'); // Navigate to the Change Password page
  };

  return (
    <Box>
      {/* Top AppBar */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Dashboard</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm">
        {error && <Typography color="error" align="center">{error}</Typography>}

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            {user ? (
              <>
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #1976d2',
                    marginBottom: '16px',
                  }}
                />
                <Typography variant="h5" gutterBottom>
                  Welcome, {user.username} 👋
                </Typography>
                <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
                <Typography variant="body1"><strong>Role:</strong> {user.role}</Typography>

                {/* Change Password Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleChangePassword}
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </>
            ) : (
              <Typography>Loading user data...</Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;
