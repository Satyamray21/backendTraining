import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Clear any previous success or error messages
    setErrorMessage('');
    setSuccessMessage('');

    // Get the JWT token from localStorage (or wherever you store it)
    const token = localStorage.getItem('authToken'); // Make sure it's stored securely!

    if (!token) {
      setErrorMessage('No authentication token found. Please log in.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/v1/users/changepassword',
        { oldpassword: oldPassword, newPassword: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );

      console.log('Password changed successfully:', response);
      setSuccessMessage('Password changed successfully!');
    } catch (error) {
      console.error('Error occurred:', error);
      if (error.response) {
        console.error('Backend error response:', error.response.data);
        setErrorMessage(error.response.data.message || 'Unknown error');
      } else {
        setErrorMessage('Network error or no response from the server');
      }
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6" // Optional: enforce minimum password length
          />
        </div>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
