import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MangaCard from '../components/MangaCard';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { searchManga } from '../services/mangaApi';
import '../pages/PageStyles/Search.css'; 

export default function Search() {
  const [mangaData, setMangaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  
  // Extract search query from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError('');
    setMangaData([]);
    
    try {
      const results = await searchManga(searchQuery, 24); // Get 24 results for clean grid
      setMangaData(results);
    } catch (err) {
      setError('Error searching manga. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <>
      {[...Array(12)].map((_, index) => (
        <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <div className="skeleton-card">
            <div className="skeleton-cover"></div>
            <div className="skeleton-title"></div>
          </div>
        </Col>
      ))}
    </>
  );

  return (
    <Container className="mt-4">
      
      {loading && (
        <>
          <div className="text-center mb-4">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Searching for "{query}"...</p>
          </div>
          
          {/* Loading skeleton grid */}
          <Row className="g-3">
            <LoadingSkeleton />
          </Row>
        </>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="text-center my-5">
          <h3 className="text-danger mb-3">Oops! Something went wrong</h3>
          <p className="text-muted">{error}</p>
        </div>
      )}
      
      {/* No results found */}
      {!loading && !error && mangaData.length === 0 && query && (
        <div className="text-center my-5">
          <h2 className="fw-bold text-muted">No manga found for "{query}"</h2>
          <p className="text-muted mt-3">Try searching with different keywords or check your spelling.</p>
        </div>
      )}
      
      {/* Search results grid */}
      {!loading && !error && mangaData.length > 0 && (
        <>
          <p className="text-muted mb-3">Found {mangaData.length} results</p>
          <Row className="g-3"> {/* g-3 provides consistent spacing */}
            {mangaData.map(manga => (
              <Col 
                key={manga.id} 
                xs={12}  /* 2 cards per row on mobile  */
                sm={6}  /* 3 cards per row on tablet */
                md={4}  /* 4 cards per row on desktop */
                lg={3}
                className="mb-4"
              >
                <MangaCard 
                  title={manga.title} 
                  coverUrl={manga.coverUrl} 
                  id={manga.id} 
                />
              </Col>
            ))}
          </Row>
        </>
      )}
      
      {/* No search query */}
      {!query && !loading && (
        <div className="text-center my-5">
          <h3 className="text-muted">Enter a search term to find manga</h3>
          <p className="text-muted" id="subtext-muted">Use the search bar above to discover your next favorite manga!</p>
        </div>
      )}
    </Container>
  );
}