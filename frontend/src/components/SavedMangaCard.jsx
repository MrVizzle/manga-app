import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown"
import SaveMangaModal from "../pages/SaveMangaModal";
import "./SavedMangaCard.css";

export default function SavedMangaCard({ manga }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);

  const handleOpenModal = (mode) => {
    setModalMode(mode);
    setShowModal(true);
  }
  
  const handleCloseModal = () => {
    setShowModal(false);
    setModalMode(null);
  }
  
  const handleCardClick  = () => {
    navigate(`/manga/${manga.mangaId}`);
  };

  return (
    <>
      <div className="saved-manga-card" onClick={handleCardClick}>
        {/* Cover Image */}
        <div className="saved-manga-cover">
          {manga.coverUrl ? (
            <img src={manga.coverUrl} alt={manga.mangaTitle} />
          ) : (
            <div className="no-cover">No Cover</div>
          )}
        </div>

        {/* Info Section */}
        <div className="saved-manga-info">
          <h3 className="saved-manga-title">{manga.mangaTitle}</h3>
          <p className="saved-manga-progress">
            Progress: <strong>Chapter {manga.chapter}</strong>
          </p>
          <span className="saved-manga-status">{manga.readingStatus}</span>
        </div>

        {/* Dropdown Menu */}
        <div
          className="saved-manga-menu"
          onClick={(e) => e.stopPropagation()} // prevent parent card click
        >
          <Dropdown align="end">
            <Dropdown.Toggle className="menu-toggle">
              Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {/* Trigger modal with different modes */}
              <Dropdown.Item onClick={() => handleOpenModal("edit-chapter")}>
                Update Chapter
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenModal("edit-status")}>
                Update Status
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenModal("delete")}>
                Delete Manga
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* -------------------------------
          Reusable Modal
      --------------------------------*/}
      {showModal && (
        <SaveMangaModal
          show={showModal}
          handleClose={handleCloseModal}
          manga={manga}
          mode={modalMode}
          onUpdate={(id) => ontimeupdate(id || manga.mangaId)}
        />
      )}
    </>
  );
}