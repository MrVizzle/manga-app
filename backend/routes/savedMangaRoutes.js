const express = require('express');
const router = express.Router();
const savedMangaController = require('../controllers/savedMangaController');
const authMiddleware = require('../middleware/authMiddleware');


// Main routes for saved manga

// Create a new saved manga entry
router.post('/', authMiddleware, savedMangaController.createSavedManga);

// Get all saved manga for the logged-in user
router.get('/', authMiddleware, savedMangaController.getAllSavedManga);

// Get a specific saved manga by ID
router.get('/:mangaId', authMiddleware, savedMangaController.getSaveByMangaId);

// Update a saved manga entry
router.put('/:mangaId', authMiddleware, savedMangaController.updateSavedManga);

// Delete a saved manga entry
router.delete('/:mangaId', authMiddleware, savedMangaController.deleteSavedManga);

module.exports = router;