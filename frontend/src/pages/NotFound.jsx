import React from 'react';
import { Link } from 'react-router-dom';
import './PageStyles/NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <h1 className="notfound-title">404 - Page Not Found</h1>
        <p className="notfound-message">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/" className="notfound-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}