const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//Authentication routes

// Register a new User
router.post('/register', authController.registerUser);

// Login existing user
router.post('/login', authController.loginUser);

module.exports = router;