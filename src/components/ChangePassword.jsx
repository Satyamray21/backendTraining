import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
  Paper,
} from '@mui/material';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/users/changePassword',
        { oldpassword: oldPassword, newPassword },
        {
          withCredentials: true, // Send cookie-based JWT
        }
      );

      setSuccessMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Unknown error');
      } else {
        setErrorMessage('Network error or no response from the server');
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>

        <form onSubmit={handleChangePassword}>
          <Stack spacing={2}>
            <TextField
              type="password"
              label="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              fullWidth
            />

            <TextField
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              inputProps={{ minLength: 6 }}
            />

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Change Password
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
