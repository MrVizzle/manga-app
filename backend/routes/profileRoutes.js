const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateAvatar } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); 

// Routes

router.get('/:username', getProfile);
router.put('/', authMiddleware, updateProfile);
router.put('/avatar', authMiddleware, updateAvatar);

module.exports = router;