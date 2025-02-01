const pool = require('../config/db');

class Rutina {
  // Obtener todas las rutinas
    static async getByDay(dia) {
        try {
        const query = 'SELECT * FROM rutinas WHERE LOWER(dia) = LOWER($1)';
        const result = await pool.query(query, [dia]);
        return result.rows;
        } catch (error) {
        throw error;
        }
    }
  
  // Insertar una nueva rutina
  static async create(dia, ejercicio, repeticiones, admin_id) {
    const query = `
      INSERT INTO rutinas (dia, ejercicio, repeticiones, admin_id)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [dia, ejercicio, repeticiones, admin_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Actualizar una rutina existente
  static async update(id, dia, ejercicio, repeticiones) {
    const query = `
      UPDATE rutinas
      SET dia = $1, ejercicio = $2, repeticiones = $3
      WHERE id = $4 RETURNING *;
    `;
    const values = [dia, ejercicio, repeticiones, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Eliminar una rutina
  static async delete(id) {
    const query = 'DELETE FROM rutinas WHERE id = $1 RETURNING *;';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Rutina;
