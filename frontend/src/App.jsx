import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './pages/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Search from './pages/Search';
import AuthRedirect from './components/AuthRedirect';
import MangaPage from './pages/MangaPage';
import Credits from './pages/Credits';
import Saved from './pages/Saved';
import ChatBot from './pages/ChatPage';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/search" element={<Search />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/credits" element={<Credits />} />
          <Route 
            path="/login" 
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            } 
          />
          <Route path="/manga/:id" element={<MangaPage />} />
          <Route path="/chatbot" element={<ChatBot />} />

          {/* catch all invalid routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

