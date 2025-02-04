const pool = require('../config/db');

class Carrito {
  // Obtener productos en el carrito por cliente
  static async getByClienteId(clienteId) {
    const query = `
      SELECT c.id, c.cantidad, c.producto_id, p.nombre, p.precio, p.imagen_url
      FROM carrito c
      INNER JOIN productos p ON c.producto_id = p.id
      WHERE c.cliente_id = $1
    `;
    const { rows } = await pool.query(query, [clienteId]);
    return rows;
  }
  
  
  
  // Añadir producto al carrito
  static async addProducto(clienteId, productoId, cantidad) {
    console.log("Insertar datos: clienteId:", clienteId, "productoId:", productoId, "cantidad:", cantidad); // Depuración
  
    const query = `
      INSERT INTO carrito (cliente_id, producto_id, cantidad)
      VALUES ($1, $2, $3)
      ON CONFLICT (cliente_id, producto_id)
      DO UPDATE SET cantidad = carrito.cantidad + $3
      RETURNING *;
    `;
  
    try {
      const { rows } = await pool.query(query, [clienteId, productoId, cantidad]);
      console.log("Resultado de la inserción:", rows); // Depuración
      return rows[0];
    } catch (error) {
      console.error("Error en la consulta SQL:", error); // Verifica si hay errores SQL
      throw error;
    }
  } 
  
  // Actualizar cantidad de un producto en el carrito
  static async updateCantidad(id, cantidad) {
    const query = `
      UPDATE carrito
      SET cantidad = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [cantidad, id]);
    return rows[0];
  }

  // Eliminar producto del carrito
  static async deleteProducto(id) {
    const query = `
      DELETE FROM carrito
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async vaciarCarrito(clienteId) {
    const query = `DELETE FROM carrito WHERE cliente_id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [clienteId]);
    return rows.length; // Devuelve el número de productos eliminados
  }
  
  
}

module.exports = Carrito;