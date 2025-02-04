const express = require('express');
const {
  getCarritoByCliente,
  addProductoToCarrito,
  updateCantidad,
  deleteProducto,
  vaciarCarrito,
  finalizarCompra,
} = require('../controllers/carritoController');

const router = express.Router();

// Ruta para obtener productos del carrito
router.get('/', getCarritoByCliente);

// Ruta para añadir producto al carrito
router.post('/', addProductoToCarrito);

router.post('/finalizar-compra', finalizarCompra);

// Ruta para actualizar cantidad de un producto
router.put('/:id', updateCantidad);

// Ruta para eliminar un producto del carrito
router.delete('/:id', deleteProducto);

// Ruta para vaciar el carrito
router.delete('/', vaciarCarrito);

module.exports = router;
