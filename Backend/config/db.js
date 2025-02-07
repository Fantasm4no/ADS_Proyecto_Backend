const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "hgranda",         // Usuario de PostgreSQL
  host: process.env.DB_HOST || "localhost",       // Host (puede ser localhost o remoto)
  database: process.env.DB_NAME || "gym_DB",  // Nombre de la base de datos
  password: process.env.DB_PASS || "Clave12345", // Contraseña de PostgreSQL
  port: process.env.DB_PORT || 5432,             // Puerto de conexión (por defecto 5432)
});

pool.connect()
  .then(() => console.log("✅ Conexión exitosa a la base de datos 'gym_DB'"))
  .catch(err => console.error("❌ Error al conectar a PostgreSQL:", err));

module.exports = pool;
