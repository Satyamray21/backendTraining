import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = async () => {
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/v1/users/changePassword', {
        email,
        code,
        newPassword
      });

      if (res.data.message) {
        setSuccess(res.data.message);
        setTimeout(() => navigate('/login'), 2000); // redirect to login
      } else {
        throw new Error('Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h5" gutterBottom>
          Reset Your Password
        </Typography>

        <TextField
          fullWidth
          label="Verification Code"
          margin="normal"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <TextField
          fullWidth
          label="New Password"
          type="password"
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleReset}
          disabled={!code || !newPassword}
        >
          Set New Password
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPassword;
