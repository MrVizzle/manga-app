import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

export default function NavbarComponent() {
  const { user, logout } = useContext(AuthContext);
  const [searchId, setSearchId] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (user && user.profilePicture) {
      setProfilePic(user.profilePicture);
    } else {
      setProfilePic(getDefaultAvatar());
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    // Optionally redirect to home page after logout
    navigate('/');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const searchQuery = searchId.trim();
    
    if (searchQuery) {
      // Navigate to the search page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

   const handleProfileClick = () => {
    if (user && user.userName) {
      navigate(`/profile/${user.userName}`);
    }
  };

  const getDefaultAvatar = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2Yzc1N2QiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTggMzJjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
  };
  
    const handleImageError = (e) => {
    console.error('Navbar - Image failed to load, using default');
    e.target.src = getDefaultAvatar();
  };
 

  return (
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/" className="navbar-title">Project-Manga</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* ===== SEARCH BAR START ===== */}
          <Form className="d-flex mx-auto" style={{ maxWidth: '400px', width: '100%' }} onSubmit={handleSearch}>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchId}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              aria-label="Search manga by ID"
            />
          </Form>
          {/* ===== SEARCH BAR END ===== */}

          <Nav className="ms-auto">
            <Nav.Link href="/saved">Saved</Nav.Link>
            <Nav.Link href="/chatbot">Manga-AI</Nav.Link>
            
            {/* Conditional rendering based on login status */}
            {user ? (
              // Show profile picture + user menu when logged in
              <div className="d-flex align-items-center">         
                {/* User Dropdown Menu */}
                <NavDropdown 
                  title={`Hello, ${user.userName || user.email || 'User'}`} 
                  id="user-nav-dropdown"
                  className="user-dropdown"
                >
                  <NavDropdown.Item onClick={handleProfileClick}>
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/credits">Credits</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
                <Image
                  src={profilePic || getDefaultAvatar()}
                  alt={`${user.userName || 'User'}'s profile`}
                  roundedCircle
                  width="32"
                  height="32"
                  className="me-2 profile-avatar-nav"
                  style={{ cursor: 'pointer', objectFit: 'cover' }}
                  onClick={handleProfileClick}
                  onError={handleImageError}
                />
              </div>
            ) : (
              // Show auth menu when not logged in
              <NavDropdown title="Account" id="auth-nav-dropdown">
                <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                <NavDropdown.Item href="/register">Sign Up</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}