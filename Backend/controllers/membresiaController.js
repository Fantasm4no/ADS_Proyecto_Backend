const Membresia = require('../models/membresias');

exports.getAllMembresias = async (req, res) => {
  try {
    const membresias = await Membresia.getAll();
    console.log("Membresías obtenidas desde la base de datos:", membresias);
    res.status(200).json(membresias);
  } catch (error) {
    console.error('Error al obtener membresías:', error);
    res.status(500).json({ msg: 'Error al obtener membresías' });
  }
};

exports.updateMembresia = async (req, res) => {
  const { id } = req.params;
  const { precio, descripcion } = req.body;

  try {
    const membresia = await Membresia.update(id, precio, descripcion);
    if (!membresia) {
      return res.status(404).json({ msg: "Membresía no encontrada" });
    }
    res.status(200).json({ msg: "Membresía actualizada con éxito", membresia });
  } catch (error) {
    console.error("Error al actualizar membresía:", error);
    res.status(500).json({ msg: "Error al actualizar membresía" });
  }
};
