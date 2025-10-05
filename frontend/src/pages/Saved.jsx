import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSavedManga } from "../services/savedManga";
import { fetchMangaById } from "../services/mangaApi";
import SavedMangaCard from "../components/SavedMangaCard";
import "./PageStyles/Saved.css";
import "./PageStyles/NonLoggedInSaved.css";
import "./PageStyles/EnhancedSaved.css";

export default function Saved() {
  const { user } = useContext(AuthContext);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reFreshTrigger, setRefreshTrigger] = useState(0); 

  useEffect(() => {
    // Only fetch saved manga if user is logged in
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const raw = await getSavedManga();
        const hydrated = await Promise.all(
          raw.map(async (item) => {
            try {
              const details = await fetchMangaById(item.mangaId);
              return {
                ...item,
                coverUrl: details.coverUrl,
              };
            } catch {
              return { ...item, coverUrl: null };
            }
          })
        );
        setSaved(hydrated);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, reFreshTrigger]);

  const handleUpdate = async (mangaId) => {
    setSaved((prev) => prev.filter((m) => m.mangaId !== mangaId));
    setRefreshTrigger((prev) => prev + 1); // Trigger re-fetch
  };

  // Filter manga based on active tab and search term
  const getFilteredManga = () => {
    let filtered = saved;

    // Filter by reading status
    if (activeTab !== 'all') {
      filtered = filtered.filter(manga => manga.readingStatus === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(manga => 
        manga.mangaTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Get counts for each tab
  const getCounts = () => {
    return {
      all: saved.length,
      reading: saved.filter(m => m.readingStatus === 'reading').length,
      completed: saved.filter(m => m.readingStatus === 'completed').length,
      dropped: saved.filter(m => m.readingStatus === 'dropped').length,
      'on-hold': saved.filter(m => m.readingStatus === 'on-hold').length,
      'plan-to-read': saved.filter(m => m.readingStatus === 'plan-to-read').length,
    };
  };

  const counts = getCounts();
  const filteredManga = getFilteredManga();

  if (loading) return <div className="saved-page"><p>Loading…</p></div>;

  // Show non-logged-in state
  if (!user) {
    return (
      <div className="non-logged-in-saved-page">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={8}>
              <h2 className="saved-page-title text-center mb-5">My Saved Manga</h2>
              
              <Card className="non-logged-in-card shadow-lg border-0">
                <Card.Body className="p-4 p-md-5 text-center">
                  <div className="lock-icon mb-4">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="lock-svg">
                      <path d="M12 1C15.31 1 18 3.69 18 7V10H19C20.1 10 21 10.9 21 12V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V12C3 10.9 3.9 10 5 10H6V7C6 3.69 8.69 1 12 1ZM12 3C9.79 3 8 4.79 8 7V10H16V7C16 4.79 14.21 3 12 3ZM12 15C13.1 15 14 15.9 14 17S13.1 19 12 19 10 18.1 10 17 10.9 15 12 15Z"/>
                    </svg>
                  </div>
                  
                  <h3 className="auth-prompt-title mb-3">
                    Sign In to Save Your Manga
                  </h3>
                  
                  <p className="auth-prompt-text mb-4">
                    You need to be logged in to save and view your favorite manga. 
                    Create an account or sign in to start building your personal collection!
                  </p>
                  
                  <Row className="justify-content-center">
                    <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                      <Button 
                        as={Link}
                        to="/login"
                        variant="primary"
                        size="lg"
                        className="w-100 auth-btn-primary"
                      >
                        Sign In
                      </Button>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Button 
                        as={Link}
                        to="/register"
                        variant="outline-primary"
                        size="lg"
                        className="w-100 auth-btn-secondary"
                      >
                        Sign Up
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Show enhanced saved manga page for logged-in users
  return (
    <div className="saved-page enhanced-saved-page">
      <Container fluid>
        <div className="saved-header">
          <h2 className="saved-page-title">📚 My Manga Library</h2>
          
          {/* Search Bar */}
          <div className="search-section">
            <Form.Control
              type="text"
              placeholder="🔍 Search your collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {/* Category Tabs */}
          <Nav variant="tabs" className="category-tabs">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
                className="tab-link"
              >
                All ({counts.all})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'reading'}
                onClick={() => setActiveTab('reading')}
                className="tab-link"
              >
                Reading ({counts.reading})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'completed'}
                onClick={() => setActiveTab('completed')}
                className="tab-link"
              >
                Completed ({counts.completed})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'plan-to-read'}
                onClick={() => setActiveTab('plan-to-read')}
                className="tab-link"
              >
                Plan to Read ({counts['plan-to-read']})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'on-hold'}
                onClick={() => setActiveTab('on-hold')}
                className="tab-link"
              >
                On Hold ({counts['on-hold']})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'dropped'}
                onClick={() => setActiveTab('dropped')}
                className="tab-link"
              >
                Dropped ({counts.dropped})
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Manga Grid */}
        <div className="saved-manga-grid">
          {filteredManga.length > 0 ? (
            filteredManga.map((m) => (
              <SavedMangaCard key={m._id} manga={m} onUpdate={handleUpdate}/>
            ))
          ) : (
            <div className="empty-state">
              <p>
                {searchTerm 
                  ? `No manga found matching "${searchTerm}"` 
                  : activeTab === 'all' 
                    ? "No saved manga yet. Start exploring to build your collection!"
                    : `No manga in "${activeTab.replace('-', ' ')}" status.`
                }
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}