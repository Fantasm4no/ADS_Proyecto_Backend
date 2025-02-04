const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  // Asegúrate de que esta importación sea correcta

// Ruta para login
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
