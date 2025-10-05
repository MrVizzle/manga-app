import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../pages/PageStyles/Login.css';


export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success/error messages
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Clear previous messages

    try {
      console.log('Attempting login with:', { identifier }); // Debug log
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
        credentials: 'include',
      });

      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();

      if (response.ok) {

        console.log('Login successful, calling login function'); 
        login(data.user, data.token);
        setMessage('Login successful! Redirecting...');
        
 
      } else {
        const errorMessage = data.error || data.message || 'Login failed';
        console.log('Login failed:', errorMessage); // Debug log
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //the form

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* Display messages */}
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        

        <label>Email/username *</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="email@gmail.com"
          required
          disabled={loading}
        />

        <label>Password *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
          disabled={loading}
        />

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="login-links">
          <Link to="/forgot-password">Forgot <span>password?</span></Link>
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}