import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  TextField,
  Box,
  Card,
  CardContent,
} from '@mui/material';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/users/changePassword',
        {
          oldpassword: oldPassword,
          newPassword: newPassword,
        },
        {
          withCredentials: true,
        }
      );

      // Use the response data here, e.g. success message
      if (response.data.statusCode === 200) {
        setSuccess(response.data.message); // Assuming the success message is in `message`
      } else {
        setError('Failed to change password');
      }
    } catch (err) {
      setError('Error changing password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Change Password
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}
          <form onSubmit={handleChangePassword}>
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;
