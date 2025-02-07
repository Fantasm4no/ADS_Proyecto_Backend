const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const os = require('os');

const authRoutes = require('./routes/authRoutes');
const rutinaRoutes = require('./routes/rutinaRoutes');
const productRoutes = require('./routes/productRoutes');
const carritoRoutes = require('./routes/carritoRoutes'); // Rutas del carrito
const membresiasRoutes = require('./routes/membresiasRoutes');
const historialRoutes = require('./routes/historialRoutes');

dotenv.config();

const app = express();

// ✅ Configurar CORS antes de definir las rutas
app.use(cors({
  origin: '*', // Permite todas las solicitudes
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ Definir rutas en el orden correcto
app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/membresias', membresiasRoutes);
app.use('/api/historial', historialRoutes);

// ✅ Obtener la IP de la red local correctamente
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let interfaceName in interfaces) {
    for (let iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // Si no se encuentra, usar localhost
}

const PORT = process.env.PORT || 5000;
const LOCAL_IP = getLocalIP();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en:
  - Local:   http://localhost:${PORT}
  - Network: http://${LOCAL_IP}:${PORT}`);
});
