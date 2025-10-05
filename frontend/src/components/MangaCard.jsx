import React from "react";
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import './MangaCard.css';

export default function MangaCard({ id, title, coverUrl}){ // Ensure id, title, and coverUrl are passed as props, so we can go /:id page
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/manga/${id}`);
  }


 return (
    <div className="manga-card" onClick={handleClick}>
      <div className="manga-cover">
        <img src={coverUrl} alt={title} />
      </div>
      <div className="manga-title">
        <h3>{title}</h3>
      </div>
    </div>
  );
}