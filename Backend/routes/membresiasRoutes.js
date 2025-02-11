const express = require('express');
const { getAllMembresias, updateMembresia, cancelarMembresia,verificarMembresiaActiva } = require('../controllers/membresiaController');

const router = express.Router();

// Ruta para obtener todas las membresías
router.get('/', getAllMembresias);

// Ruta para actualizar una membresía
router.put('/:id', updateMembresia);
router.post('/cancelar', cancelarMembresia);
router.get('/verificar/:clienteId', verificarMembresiaActiva);
router.get('/activa/:clienteId', verificarMembresiaActiva);

module.exports = router;
