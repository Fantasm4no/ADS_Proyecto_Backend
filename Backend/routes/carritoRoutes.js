const express = require('express');
const {
  getCarritoByCliente,
  addToCarrito,  // Aquí unificamos la función para productos y membresías
  updateCantidad,
  deleteProducto,
  vaciarCarrito,
  finalizarCompra,
} = require('../controllers/carritoController');

const router = express.Router();

// Ruta para obtener los productos y membresías en el carrito
router.get('/', getCarritoByCliente);

// Ruta para añadir un producto o membresía al carrito
router.post('/', addToCarrito);

// Ruta para actualizar cantidad de un producto en el carrito
router.put('/:id', updateCantidad);

// Ruta para eliminar un producto o membresía del carrito
router.delete('/:id', deleteProducto);

// Ruta para vaciar el carrito del usuario
router.delete('/', vaciarCarrito);

// Ruta para finalizar compra
router.post('/finalizar-compra', finalizarCompra);

module.exports = router;
