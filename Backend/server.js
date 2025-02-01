const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // Rutas de autenticación
const rutinaRoutes = require('./routes/rutinaRoutes');  // Rutas de las rutinas

dotenv.config();  // Cargar las variables de entorno

const app = express();
app.use(cors());
app.use(express.json());  // Para poder leer el cuerpo de las solicitudes en formato JSON

// Rutas
app.use('/api/auth', authRoutes);  // Ruta de autenticación
app.use('/api/rutinas', rutinaRoutes);  // Ruta de las rutinas

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
