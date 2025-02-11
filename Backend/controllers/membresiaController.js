const Membresia = require('../models/membresias');
const pool = require("../config/db"); // Importar la conexión a PostgreSQL


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

exports.cancelarMembresia = async (req, res) => {
  const { clienteId } = req.body;

  if (!clienteId) {
    return res.status(400).json({ msg: "Falta el ID del cliente." });
  }

  try {
    // Buscar si el usuario tiene una membresía activa
    const query = `
      DELETE FROM historial_compras 
      WHERE user_id = $1 AND membresia_id IS NOT NULL 
        AND fecha >= NOW() - INTERVAL '1 month'
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [clienteId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "No tienes una membresía activa para cancelar." });
    }

    res.json({ msg: "Membresía cancelada con éxito." });
  } catch (error) {
    console.error("Error al cancelar membresía:", error);
    res.status(500).json({ msg: "Error interno al cancelar la membresía." });
  }
};


exports.verificarMembresiaActiva = async (req, res) => {
  const { clienteId } = req.params;

  try {
    const query = `
      SELECT membresia_id FROM historial_compras 
      WHERE user_id = $1 AND fecha >= NOW() - INTERVAL '30 days'
      ORDER BY fecha DESC LIMIT 1;
    `;

    const { rows } = await pool.query(query, [clienteId]);

    if (rows.length > 0) {
      res.status(200).json({ membresia_id: rows[0].membresia_id });
    } else {
      res.status(200).json({ membresia_id: null });
    }
  } catch (error) {
    console.error("Error al verificar membresía activa:", error);
    res.status(500).json({ msg: "Error interno al verificar membresía activa." });
  }
};

