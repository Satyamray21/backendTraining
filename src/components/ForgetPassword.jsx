import React, { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/v1/users/send-reset-code', { email });

      if (res.data.message) {
        setSent(true);
        navigate('/reset-password', { state: { email } }); // Navigate to next step with email
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h5" gutterBottom>Forgot Password</Typography>

        <TextField
          fullWidth
          label="Your email"
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {sent && <Alert severity="success">Code sent! Check your inbox.</Alert>}

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSendCode}
          disabled={!email.trim()}
        >
          Send Reset Code
        </Button>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
