import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../pages/PageStyles/Login.css'; 

export default function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success/error messages
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if passwords match whenever they change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Clear previous messages

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    // Check password length
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting registration with:', { userName, email }); // Debug log
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, email, password }),
        credentials: 'include',
      });

      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok) {
        console.log('Registration successful - received data:', data);
        console.log('User data:', data.user);
        console.log('Token:', data.token);
        
        // Auto-login the user after successful registration
        login(data.user, data.token);
        setMessage('Registration successful! Logging you in...');
        
        // Small delay to show success message
        setTimeout(() => {
          navigate('/browse');
        }, 1000);
      } else {
        const errorMessage = data.error || data.message || 'Registration failed';
        console.log('Registration failed:', errorMessage); // Debug log
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {/* Display messages */}
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

       

        <label>Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@gmail.com"
          required
          disabled={loading}
        />

        <label>Password *</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="password"
          required
          disabled={loading}
          minLength="6"
        />

        <label>Confirm Password *</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="password"
          required
          disabled={loading}
          className={confirmPassword && !passwordsMatch ? 'password-mismatch' : ''}
        />
        
        {/* Password match indicator */}
        {confirmPassword && (
          <div className={`password-indicator ${passwordsMatch ? 'match' : 'no-match'}`}>
            {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
          </div>
        )}

        <label>Username *</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="username"
          required
          disabled={loading}
        />

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="login-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}