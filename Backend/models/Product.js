const pool = require('../config/db');

class Product {
  static async getAll() {
    try {
      const { rows } = await pool.query('SELECT * FROM productos');
      return rows;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  static async checkStock(productoId, cantidad) {
    const query = `SELECT stock FROM productos WHERE id = $1`;
    const { rows } = await pool.query(query, [productoId]);

    if (rows.length === 0) {
      throw new Error("Producto no encontrado");
    }

    if (rows[0].stock < cantidad) {
      throw new Error("Stock insuficiente");
    }
  }

  static async getById(productoId) {
    const query = `SELECT * FROM productos WHERE id = $1`;
    const { rows } = await pool.query(query, [productoId]);
    return rows[0] || null;
  } 

  static async create(nombre, descripcion, precio, stock, imagen_url, admin_id) {
    try {
      const { rows } = await pool.query(
        'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, admin_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombre, descripcion, precio, stock, imagen_url, admin_id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  static async update(id, nombre, descripcion, precio, stock, imagen_url) {
    try {
      const { rows } = await pool.query(
        'UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, stock=$4, imagen_url=$5 WHERE id=$6 RETURNING *',
        [nombre, descripcion, precio, stock, imagen_url, id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await pool.query('DELETE FROM productos WHERE id=$1', [id]);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  static async updateStock(productoId, nuevoStock) {
    const query = `UPDATE productos SET stock = $1 WHERE id = $2 RETURNING *;`;
    const { rows } = await pool.query(query, [nuevoStock, productoId]);
    return rows[0];
  }
}

module.exports = Product;
