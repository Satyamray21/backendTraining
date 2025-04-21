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
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Track dialog open state
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

  const handleDeleteUserByEmail = async () => {
    if (!deleteEmail.trim()) {
      alert('Please enter a valid email address.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete user: ${deleteEmail}?`);
    if (!confirmDelete) return;

    try {
      await axios.delete('http://localhost:5000/api/v1/users/deleteUserByEmail', {
        data: { email: deleteEmail },
        withCredentials: true,
      });
      alert('User deleted successfully!');
      setDeleteEmail('');

      if (showAllUsers) {
        setUsers(prev => prev.filter(u => u.email !== deleteEmail));
      }

      // Close the modal after successful deletion
      setOpenDeleteDialog(false);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true); // Open the delete dialog
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Close the delete dialog without taking action
  };

  return (
    <Box>
      {/* AppBar with delete user trigger */}
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ flex: 1, minWidth: '150px' }}>
            Admin Dashboard
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button color="inherit" onClick={handleChangePassword}>
              Change Password
            </Button>
            {user?.role === 'admin' && (
              <Button color="inherit" onClick={handleShowAllUsers}>
                {showAllUsers ? 'My Profile' : 'All Users'}
              </Button>
            )}
            {user?.role === 'admin' && (
              <Button color="error" onClick={handleOpenDeleteDialog}>
                Delete User
              </Button>
            )}
          </Box>

          {/* Logout Button moved to the end */}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {error && <Typography color="error">{error}</Typography>}

        {/* All Users List */}
        {showAllUsers ? (
          <>
            <Typography variant="h5" gutterBottom>
              All Users
            </Typography>
            <Grid container spacing={2}>
              {users.map((u) => (
                <Grid item xs={12} sm={6} md={4} key={u._id}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {u.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {u.email}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
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
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {user.role}
              </Typography>
            </Card>
          )
        )}
      </Container>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the email address of the user you wish to delete.
          </Typography>
          <TextField
            label="User Email"
            variant="outlined"
            fullWidth
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUserByEmail} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
