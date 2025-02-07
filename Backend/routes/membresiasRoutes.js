const express = require('express');
const { getAllMembresias, updateMembresia } = require('../controllers/membresiaController');

const router = express.Router();

// Ruta para obtener todas las membresías
router.get('/', getAllMembresias);

// Ruta para actualizar una membresía
router.put('/:id', updateMembresia);

module.exports = router;
