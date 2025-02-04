const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const rutinaRoutes = require('./routes/rutinaRoutes');
const productRoutes = require('./routes/productRoutes');
const carritoRoutes = require('./routes/carritoRoutes'); // Rutas del carrito

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carrito', carritoRoutes); // Usa las rutas reales del carrito

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
