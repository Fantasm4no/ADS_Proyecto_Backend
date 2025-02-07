const pool = require("../config/db");
const jwt = require("jsonwebtoken");

exports.getHistorialByCliente = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No autorizado" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
      const cliente_id = decoded.id || decoded.cliente_id;
  
      if (!cliente_id) {
        return res.status(400).json({ msg: "Falta el cliente_id" });
      }
  
      // Obtener el historial de compras
      const historial = await pool.query(
        `
        SELECT h.*, 
               p.nombre AS producto_nombre, 
               p.imagen_url AS producto_imagen,
               m.nombre AS membresia_nombre
        FROM historial_compras h
        LEFT JOIN productos p ON h.producto_id = p.id
        LEFT JOIN membresias m ON h.membresia_id = m.id
        WHERE h.user_id = $1
        ORDER BY h.fecha DESC
        `,
        [cliente_id]
      );
  
      const historialEnriquecido = historial.rows.map((item) => ({
        fecha: item.fecha,
        nombre: item.producto_nombre || item.membresia_nombre || "N/A",
        imagen: item.producto_imagen || null,
        cantidad: item.cantidad,
        total: parseFloat(item.total),
      }));
  
      res.status(200).json(historialEnriquecido);
    } catch (error) {
      console.error("Error al obtener el historial de compras:", error);
      res.status(500).json({ msg: "Error al obtener el historial de compras" });
    }
  };
  