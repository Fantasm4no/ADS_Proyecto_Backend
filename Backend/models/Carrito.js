const pool = require('../config/db');

class Carrito {

  static async getItemById(id) {
    const query = `SELECT * FROM carrito WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
  
  // Obtener productos y membresías en el carrito por cliente
  static async getByClienteId(clienteId) {
    const query = `
      SELECT c.id, c.cantidad, c.producto_id, c.membresia_id,
             COALESCE(p.nombre, m.nombre) AS nombre,
             COALESCE(p.precio, m.precio) AS precio,
             COALESCE(p.imagen_url, m.imagen_url) AS imagen_url
      FROM carrito c
      LEFT JOIN productos p ON c.producto_id = p.id
      LEFT JOIN membresias m ON c.membresia_id = m.id
      WHERE c.cliente_id = $1
    `;
    const { rows } = await pool.query(query, [clienteId]);
    return rows;
  }   

  // Añadir producto al carrito
  static async addProducto(clienteId, productoId, cantidad) {
    const query = `
      INSERT INTO carrito (cliente_id, producto_id, cantidad, precio)
      VALUES ($1, $2, $3)
      ON CONFLICT (cliente_id, producto_id)
      DO UPDATE SET cantidad = carrito.cantidad + $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [clienteId, productoId, cantidad]);
    return rows[0];
  }

  static async addMembresia(clienteId, membresiaId) {
    // Verificar si el cliente ya tiene una membresía en el carrito
    const checkQuery = `SELECT * FROM carrito WHERE cliente_id = $1 AND membresia_id IS NOT NULL`;
    const { rows } = await pool.query(checkQuery, [clienteId]);
  
    if (rows.length > 0) {
      throw new Error("Ya tienes una membresía en el carrito. Elimina la anterior para agregar una nueva.");
    }
  
    // Insertar la nueva membresía
    const query = `
      INSERT INTO carrito (cliente_id, membresia_id, cantidad)
      VALUES ($1, $2, 1) 
      RETURNING *;
    `;
  
    const { rows: insertedRows } = await pool.query(query, [clienteId, membresiaId]);
    return insertedRows[0];
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
    // Verificar si es una membresía
    const checkQuery = `SELECT membresia_id FROM carrito WHERE id = $1`;
    const { rows } = await pool.query(checkQuery, [id]);
  
    if (rows.length > 0 && rows[0].membresia_id) {
      throw new Error("No se puede modificar la cantidad de una membresía");
    }
  
    // Si no es membresía, permitir actualización de cantidad
    const query = `UPDATE carrito SET cantidad = $1 WHERE id = $2 RETURNING *;`;
    const { rows: updatedRows } = await pool.query(query, [cantidad, id]);
    return updatedRows[0];
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