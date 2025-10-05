const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

// Routes for chatbot interaction

router.post('/chatbot', authMiddleware, chatController.chatWithBot);

module.exports = router;