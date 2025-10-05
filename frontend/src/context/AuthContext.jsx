import React, { createContext, useState, useEffect } from 'react';

//  Create Context
export const AuthContext = createContext();

//  Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds logged-in user info
  const [token, setToken] = useState(null); // JWT Token

  // On App Load -> Check LocalStorage for Token, keeps user logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser && storedUser !== 'undefined') {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  
  // Login Function -> saves to state and localStorage
  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout Function -> clears state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updateUserData) => {
    const newUserData = { ...user, ...updateUserData};
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};