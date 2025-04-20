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
  Avatar,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const navigate = useNavigate();

  // Fetch current logged-in user
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

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/users/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      setError('Logout failed');
      console.error('Logout error:', err);
    }
  };

  // Change password
  const handleChangePassword = () => {
    navigate('/change-password');
  };

  // Fetch all users (admin only)
  const handleShowAllUsers = async () => {
    if (!showAllUsers) {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/users/getAllUser', {
          withCredentials: true,
        });
        setUsers(res.data.data);
        setShowAllUsers(true);
      } catch (err) {
        setError('Failed to fetch all users');
        console.error('Error fetching all users:', err);
      }
    } else {
      setShowAllUsers(false);
    }
  };

  return (
    <Box>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={handleChangePassword}>
              Change Password
            </Button>
            {user?.role === 'admin' && (
              <Button color="inherit" onClick={handleShowAllUsers}>
                {showAllUsers ? 'My Profile' : 'All Users'}
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {error && <Typography color="error">{error}</Typography>}

        {/* All Users List */}
        {showAllUsers ? (
          <>
            <Typography variant="h5" gutterBottom>All Users</Typography>
            <Grid container spacing={2}>
              {users.map((u) => (
                <Grid item xs={12} sm={6} md={4} key={u._id}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{u.username}</Typography>
                    <Typography variant="body2" color="textSecondary">{u.email}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          // User Profile View
          user && (
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
              <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
              <Typography variant="body1"><strong>Role:</strong> {user.role}</Typography>
            </Card>
          )
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
