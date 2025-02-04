const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config(); // Cargar variables de entorno

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Datos recibidos en el login:", { email, password });

  if (!email || !password) {
    return res.status(400).json({ msg: "Faltan datos para iniciar sesión." });
  }

  try {
    const user = await User.findByEmail(email.toLowerCase()); // Convertimos email a minúsculas

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || "cliente" }, 
      process.env.JWT_SECRET || "clave_secreta", 
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ msg: "Error interno del servidor." });
  }
};

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body; // Datos enviados desde el frontend
  console.log("Datos recibidos en el registro:", { nombre, email, password });

  if (!nombre || !email || !password) {
    return res.status(400).json({ msg: "Faltan datos para el registro." });
  }

  try {
    // Verifica si el usuario ya existe
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: "El usuario ya está registrado." });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario
    const query = `
      INSERT INTO users (nombre, email, password, role)
      VALUES ($1, $2, $3, 'cliente') RETURNING *;
    `;
    const values = [nombre, email, hashedPassword];
    const { rows } = await pool.query(query, values);

    res.status(201).json({ msg: "Usuario registrado con éxito.", user: rows[0] });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ msg: "Error interno en el servidor." });
  }
};
