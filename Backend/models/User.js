const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // Usar la conexión a la base de datos

class User {
  // Buscar usuario por correo
  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0]; // Retorna el primer usuario encontrado
  }

  // Crear un usuario
  static async create(nombre, email, password, role) {
    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { rows } = await pool.query(
      'INSERT INTO users (nombre, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, hashedPassword, role]
    );
    return rows[0]; // Retorna el usuario recién creado
  }
}

module.exports = User;
