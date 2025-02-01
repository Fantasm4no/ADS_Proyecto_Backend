const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",         // Usuario de PostgreSQL
  host: process.env.DB_HOST || "localhost",       // Host (puede ser localhost o remoto)
  database: process.env.DB_NAME || "Ferreteria",  // Nombre de la base de datos
  password: process.env.DB_PASS || "tu_contraseña", // Contraseña de PostgreSQL
  port: process.env.DB_PORT || 5432,             // Puerto de conexión (por defecto 5432)
});

pool.connect()
  .then(() => console.log("✅ Conexión exitosa a la base de datos 'Ferreteria'"))
  .catch(err => console.error("❌ Error al conectar a PostgreSQL:", err));

module.exports = pool;
