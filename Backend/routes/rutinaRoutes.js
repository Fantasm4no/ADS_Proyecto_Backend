const express = require('express');
const rutinaController = require('../controllers/rutinaController');

const router = express.Router();

// Obtener rutinas del día actual
router.get('/hoy', rutinaController.getRutinasByDay);

// Crear una nueva rutina
router.post('/', rutinaController.createRutina);

// Actualizar una rutina
router.put('/:id', rutinaController.updateRutina);

// Eliminar una rutina
router.delete('/:id', rutinaController.deleteRutina);

module.exports = router;
