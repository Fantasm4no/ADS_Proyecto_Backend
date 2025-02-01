const Rutina = require('../models/Rutinas');

// Obtener rutinas del día actual
exports.getRutinasByDay = async (req, res) => {
    try {
      // Obtener el día actual con la primera letra en mayúscula
      const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const diaActual = diasSemana[new Date().getDay()];
      const diaFormatoBD = diaActual.charAt(0).toUpperCase() + diaActual.slice(1);
      const rutinas = await Rutina.getByDay(diaFormatoBD);
      res.status(200).json(rutinas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las rutinas del día actual' });
    }
};   

// Crear una nueva rutina
exports.createRutina = async (req, res) => {
  const { dia, ejercicio, repeticiones, admin_id } = req.body;
  try {
    const nuevaRutina = await Rutina.create(dia, ejercicio, repeticiones, admin_id);
    res.status(201).json(nuevaRutina);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la rutina' });
  }
};

// Actualizar una rutina existente
exports.updateRutina = async (req, res) => {
  const { id } = req.params;
  const { dia, ejercicio, repeticiones } = req.body;
  try {
    const rutinaActualizada = await Rutina.update(id, dia, ejercicio, repeticiones);
    res.status(200).json(rutinaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la rutina' });
  }
};

// Eliminar una rutina
exports.deleteRutina = async (req, res) => {
  const { id } = req.params;
  try {
    const rutinaEliminada = await Rutina.delete(id);
    res.status(200).json(rutinaEliminada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la rutina' });
  }
};
