import { useState} from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../pages/PageStyles/SaveMangaModal.css";
import { getSavedManga, updateSavedManga, createSavedManga, deleteSavedManga } from "../services/savedManga";


export default function SaveMangaModal({ show, handleClose, manga, mode="create", onSaveData }) {
  const [chapter, setChapter] = useState("");
  const [readingStatus, setStatus] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === "create") {
        // 1. Fetch user’s saved manga, to check for Duplicates
        const savedMangaList = await getSavedManga();
        const existing = savedMangaList.find(
          (item) => item.mangaId === manga.mangaId
        );

        if (existing) {
          // 2. If exists, update both chapter + status
          await updateSavedManga(manga.mangaId, {
            chapter,
            readingStatus,
          });
          console.log("Manga updated successfully!");
        } else {
          // 3. Otherwise, create new
          await createSavedManga({
            mangaId: manga.mangaId,
            mangaTitle: manga.title,
            chapter,
            readingStatus,
          });
          console.log("Manga saved successfully!");
        }
      }

      if (mode === "edit-chapter") {
        await updateSavedManga(manga.mangaId, { chapter });
        console.log("Chapter updated successfully!");
      }

      if (mode === "edit-status") {
        await updateSavedManga(manga.mangaId, { readingStatus });
        console.log("Reading status updated successfully!");
      }

      if (mode === "delete") {
        await deleteSavedManga(manga.mangaId);
        console.log("Manga deleted successfully!");
      }

      // Notify parent
      if (onSaveData) onSaveData();
      handleClose();
    } catch (error) {
      console.error("Error saving manga:", error);
      alert("Failed to save manga. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create": return "Add to Manga Shelf";
      case "edit-chapter": return "Update Chapter";
      case "edit-status": return "Update Reading Status";
      case "delete": return "Delete Manga";
      default: return "Manga Action";
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* Header */}
      <Modal.Header closeButton>
        <Modal.Title>{getTitle()}</Modal.Title>
      </Modal.Header>

      {/* Body */}
      <Modal.Body>
        <p>
          <strong>{mode === "delete" ? "Are you sure you want to delete:" : "Saving:"}</strong> {manga.title}
        </p>

        {/* Show Chapter input if creating or editing chapter */}
        {(mode === "create" || mode === "edit-chapter") && (
          <Form.Group className="mb-3">
            <Form.Label>Chapter #</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            />
          </Form.Group>
        )}

        {/* Show Status dropdown if creating or editing status */}
        {(mode === "create" || mode === "edit-status") && (
          <Form.Group>
            <Form.Label>Reading Status</Form.Label>
            <Form.Select
              value={readingStatus}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select status...</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
              <option value="plan-to-read">Plan to Read</option>
              <option value="on-hold">On Hold</option>
              <option value="dropped">Dropped</option>
            </Form.Select>
          </Form.Group>
        )}

        {/* Delete mode shows confirmation only */}
        {mode === "delete" && (
          <p className="text-danger">
            This action cannot be undone.
          </p>
        )}
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        {mode === "delete" ? (
          <Button variant="danger" onClick={handleSubmit} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}