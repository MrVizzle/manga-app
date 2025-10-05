import React from 'react';
import '../pages/PageStyles/Credits.css';

export default function Credits() {
  return (
    <div className="credits-page">
      <div className="credits-container">
        <div className="credits-content">
          <h1 className="credits-title">Credits & Acknowledgments</h1>
          
          <div className="divider"></div>
          
          <div className="api-credit-section">
            <div className="api-header">
              <h2 className="api-title">MangaDex API</h2>
              <span className="api-badge">Data Provider</span>
            </div>
            
            <div className="api-description">
              <p>
                This project is powered by the <strong>MangaDex API</strong>, which provides 
                comprehensive manga information, metadata, and cover images. We're grateful 
                for their open and accessible API that makes projects like this possible.
              </p>
            </div>
            
            <div className="api-links">
              <a 
                href="https://api.mangadex.org/docs/03-manga/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="api-link primary"
              >
                Explore MangaDex API
              </a>
              <a 
                href="https://mangadex.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="api-link secondary"
              >
                Visit MangaDex
              </a>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div className="acknowledgment-section">
            <h3 className="acknowledgment-title">Special Thanks</h3>
            <p className="acknowledgment-text">
              Thank you to the MangaDex team and community for maintaining such a 
              valuable resource for manga enthusiasts worldwide. Their dedication 
              to providing free and open access to manga data makes innovative 
              projects possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}