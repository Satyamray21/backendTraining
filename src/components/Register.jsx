import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography,
  InputLabel, MenuItem, FormControl, Select
} from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: '',
    avatar: null,
    coverImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!data.username.trim()) errors.username = 'Username is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.password.trim()) errors.password = 'Password is required';
    if (!data.role.trim()) errors.role = 'Role is required';
    if (!data.avatar) errors.avatar = 'Avatar is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const formDataToSend = new FormData();
      for (let key in formData) {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      }

      // Debug: show form data content
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      try {
        const response = await axios.post('http://localhost:5000/api/v1/users/register', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        console.log('User registered successfully:', response.data);
        alert('Registration successful!');
      } catch (error) {
        console.error('Error during registration:', error?.response?.data?.message || error.message);
        alert(`Registration failed: ${error?.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', maxWidth: 400, mx: 'auto', p: 3 }}
    >
      <Typography variant="h4" gutterBottom>Register</Typography>

      <TextField label="Full Name" name="fullName" value={formData.fullName}
        onChange={handleChange} error={!!errors.fullName} helperText={errors.fullName}
        fullWidth margin="normal" />

      <TextField label="Username" name="username" value={formData.username}
        onChange={handleChange} error={!!errors.username} helperText={errors.username}
        fullWidth margin="normal" />

      <TextField label="Email" name="email" type="email" value={formData.email}
        onChange={handleChange} error={!!errors.email} helperText={errors.email}
        fullWidth margin="normal" />

      <TextField label="Password" name="password" type="password" value={formData.password}
        onChange={handleChange} error={!!errors.password} helperText={errors.password}
        fullWidth margin="normal" />

      <FormControl fullWidth margin="normal" error={!!errors.role}>
        <InputLabel>Role</InputLabel>
        <Select name="role" value={formData.role} onChange={handleChange}>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        {errors.role && <Typography variant="body2" color="error">{errors.role}</Typography>}
      </FormControl>

      <Box mt={2}>
        <InputLabel>Avatar *</InputLabel>
        <Button variant="contained" component="label">
          Upload Avatar
          <input type="file" name="avatar" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
        {errors.avatar && <Typography variant="body2" color="error">{errors.avatar}</Typography>}
      </Box>

      <Box mt={2}>
        <InputLabel>Cover Image (optional)</InputLabel>
        <Button variant="contained" component="label">
          Upload Cover Image
          <input type="file" name="coverImage" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
      </Box>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
