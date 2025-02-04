const bcrypt = require("bcryptjs");
const pool = require("../config/db");

class User {
  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const { rows } = await pool.query(query, [email.toLowerCase()]); // Asegurar minúsculas
      return rows[0] || null;
    } catch (error) {
      console.error("Error en findByEmail:", error);
      return null;
    }
  }

  static async create(nombre, email, password, role = "cliente") {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { rows } = await pool.query(
        "INSERT INTO users (nombre, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [nombre, email.toLowerCase(), hashedPassword, role]
      );
      return rows[0];
    } catch (error) {
      console.error("Error en create:", error);
      throw new Error("Error al crear usuario.");
    }
  }
}

module.exports = User;
