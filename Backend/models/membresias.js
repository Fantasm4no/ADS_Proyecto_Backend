const pool = require('../config/db');

class Membresia {
  static async getById(id) {
    const query = 'SELECT * FROM membresias WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM membresias';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async update(id, precio, descripcion) {
    const query = `
      UPDATE membresias
      SET precio = $1, descripcion = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [precio, descripcion, id]);
    return rows[0];
  }
}

module.exports = Membresia;
