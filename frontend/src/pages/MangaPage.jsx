import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { fetchMangaById} from '../services/mangaApi';
import { getSavedManga } from "../services/savedManga";
import SaveButton from '../components/SaveButton';
import SaveMangaModal from './SaveMangaModal';
import '../pages/PageStyles/MangaPage.css'; 

export default function MangaPage() {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showModal, setShowModal] = useState(false);


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  useEffect(() => {
    async function getManga() {
      try {
        setLoading(true);
        const data = await fetchMangaById(id);
        setManga(data);

        const savedList = await getSavedManga();
        const alreadySaved = savedList.some((item) => item.mangaId === id);
        setIsSaved(alreadySaved);

      } catch (err) {
        console.error(err);
        setError('Failed to load manga');
      } finally {
        setLoading(false);
      }
    }
    getManga();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const getText = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value.en || value.english || Object.values(value)[0] || '';
    }
    return '';
  };

    return (
      <Container fluid className="manga-page">
        <div className="manga-container">
          {/* Cover Image */}
          <div className="cover-section">
            <img
              src={manga.coverUrl}
              alt={getText(manga.title)}
              className="cover-image img-fluid"
            />
          </div>

          {/* Content */}
          <div className="content-section">
            {/* Title and Save Button */}
            <div className="header">
              <div>
                <h1 className="title">{getText(manga.title)}</h1>
                <p className="author">{getText(manga.author)}</p>
              </div>
              {/* ✅ Trigger modal with SaveButton */}
              <SaveButton onSave={handleOpenModal} isSaved={isSaved} />
            </div>

            <div className="divider"></div>

            {/* Rating and Info Grid */}
            <div className="info-grid">
              <div className="rating-section">
                <div className="rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`star ${i < 4 ? 'filled' : ''}`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                  </div>
                  <span className="rating-number">4.5</span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value status-badge">{getText(manga.status)}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Chapters:</span>
                <span className="info-value status-badge">
                  {getText(manga.chapters) || 'Unknown'}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Genres:</span>
                <div className="genre-tags">
                  {manga.tags && manga.tags.map((tag, index) => (
                    <span key={index} className="genre-tag">{getText(tag)}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Description */}
            <div className="description-section">
              <h3 className="description-title">Description</h3>
              <div className="description-content">
                <p>{getText(manga.description)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Modal */}
        <SaveMangaModal
          show={showModal}
          handleClose={handleCloseModal}
          manga={{ ...manga, mangaId: manga.id }} 
        />
      </Container>
    );
}