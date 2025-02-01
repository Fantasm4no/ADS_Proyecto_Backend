const pool = require('../config/db');

class Product {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM products');
    return rows;
  }

  static async create(nombre, descripcion, precio, stock) {
    const { rows } = await pool.query(
      'INSERT INTO products (nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, precio, stock]
    );
    return rows[0];
  }

  static async update(id, nombre, descripcion, precio, stock) {
    const { rows } = await pool.query(
      'UPDATE products SET nombre=$1, descripcion=$2, precio=$3, stock=$4 WHERE id=$5 RETURNING *',
      [nombre, descripcion, precio, stock, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
  }
}

module.exports = Product;
