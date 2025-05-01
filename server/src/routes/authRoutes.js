const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.register);

// Login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login);

// Get current user
router.get('/user', auth, authController.getProfile);

// Update profile
router.put('/profile', auth, authController.updateProfile);

// Şifre sıfırlama rotası
router.post('/forgot-password', [
  check('email', 'Lütfen geçerli bir e-posta adresi girin').isEmail()
], authController.forgotPassword);

module.exports = router; 