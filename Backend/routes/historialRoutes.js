const express = require('express');
const historialController = require('../controllers/historialController');
const router = express.Router();

// Ruta para obtener el historial de compras por cliente
router.get('/', historialController.getHistorialByCliente);

module.exports = router;
