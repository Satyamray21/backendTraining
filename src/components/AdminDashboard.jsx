import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/v1/users/all', { withCredentials: true });
      setUsers(res.data.data || []);
      setUserRole(res.data.data[0]?.role || ""); // Assuming the requester is also returned
    } catch (err) {
      console.error("Error fetching users:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/users/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (userRole !== 'admin') {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h5" color="error">Access Denied: Admins only</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Full Name</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.fullName}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
