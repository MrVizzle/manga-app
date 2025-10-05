import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';
import GetStarted from '../components/GetStartedButton';
import '../pages/PageStyles/Hero.css';

export default function Hero() {
  const [hoveredCard, setHoveredCard] = useState('both');
  const navigate = useNavigate();

  const handleCardHover = (cardType) => {
    setHoveredCard(cardType);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const saveCardContent = {
    description: "Whether you're following long-running series, trying out hidden gems, or juggling multiple titles at once, our platform ensures your collection is organized, accessible, and always up-to-date.",
    features: [
      "Track reading progress across all devices",
      "Never forget where you left off",
      "Organize by genres, status, and favorites"
    ]
  };

  const aiCardContent = {
    description: "Our AI-powered assistant analyzes your saved titles, reading history, and preferences to suggest manga you'll actually want to read.",
    features: [
      "Personalized recommendations just for you",
      "Discover hidden gems and new authors",
      "Your manga-loving friend who always knows what's next",
      "" // Empty string to maintain layout consistency
    ]
  };

  const aiActionButton = (
    <button 
      className="action-button"
      onClick={() => navigate('/mangaai')}
    >
      Go to Manga-AI →
    </button>
  );

  const searchActionButton = (
    <button 
      className="action-button"
      onClick={() => navigate('/search')}
    >
      Find Manga Now!! →
    </button>
  )

  return (
    <div className="hero-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          {/* Main Hero Content */}
          <div className="hero-content">
            <div className="hero-text">
              <h2 className="hero-title">
                Welcome to <span className="highlight">Project Manga</span>
              </h2>
              <p className="hero-description">
                Your personal manga library in the cloud. We make it effortless for you to{' '}
                <span className="feature-highlight save">save manga you love</span>,{' '}
                <span className="feature-highlight track">track your reading progress</span>, and{' '}
                <span className="feature-highlight discover">discover fresh recommendations</span> tailored just for you.
              </p>
            </div>
            <GetStarted />
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h3 className="features-title">
              Never Lose Your Place—Save and Manage Manga Easily
            </h3>
            
            <div className="cards-grid">
              <SkeletonCard
                icon={BookOpen}
                title="Save and organize your manga"
                hoverContent={saveCardContent}
                cardType="save"
                hoveredCard= "save"
                onHover={() => {}}
                onLeave={handleCardLeave}
                actionButton={searchActionButton}
              />

               <SkeletonCard
                icon={BookOpen}
                title="Get recommendations from our AI"
                hoverContent={aiCardContent}
                cardType="ai"
                hoveredCard= "ai"
                onHover={() => {}}
                onLeave={handleCardLeave}
                actionButton={aiActionButton}
              />
              
            </div>
          </div>

          {/* Credits Section */}
          <div className="hero-credits">
            <h3 className="credits-title">Powered by MangaDex API</h3>
            <p className="credits-description">
              All manga data provided by the MangaDex API. Project Manga would not be possible without their incredible resources.
            </p>
            <button 
              className="credits-button"
              onClick={() => navigate('/credits')}
            >
              Credits →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}