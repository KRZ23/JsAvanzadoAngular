const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/reset-password', authController.resetPassword);
router.post('/check-password', authController.checkCurrentPassword);

// Rutas protegidas (requieren autenticación)
router.get('/users', authMiddleware, authController.getAllUsers);
router.get('/users/:id', authMiddleware, authController.getUser);

module.exports = router;