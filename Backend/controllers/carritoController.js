const Carrito = require('../models/Carrito');
const Product = require("../models/Product");
const jwt = require('jsonwebtoken');

exports.addProductoToCarrito = async (req, res) => {
  const { cliente_id, producto_id, cantidad } = req.body;

  console.log("Datos recibidos en el backend:", { cliente_id, producto_id, cantidad });

  if (!cliente_id || !producto_id || !cantidad) {
    return res.status(400).json({ msg: "Datos inválidos para añadir al carrito" });
  }

  try {
    // Verificar que el producto existe y tiene stock suficiente
    await Product.checkStock(producto_id, cantidad);

    // Añadir el producto al carrito
    const producto = await Carrito.addProducto(cliente_id, producto_id, cantidad);
    res.status(201).json(producto);
  } catch (error) {
    console.error("Error al añadir producto al carrito:", error.message);
    res.status(400).json({ msg: error.message });
  }
};

exports.getCarritoByCliente = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
    const cliente_id = decoded.id || decoded.cliente_id;

    if (!cliente_id) {
      return res.status(400).json({ msg: "Falta el cliente_id" });
    }

    const productos = await Carrito.getByClienteId(cliente_id);
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ msg: "Error al obtener el carrito" });
  }
};

// Actualizar cantidad de un producto en el carrito
exports.updateCantidad = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  try {
    const producto = await Carrito.updateCantidad(id, cantidad);
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al actualizar cantidad del producto:', error);
    res.status(500).json({ msg: 'Error al actualizar cantidad del producto' });
  }
};

// Eliminar un producto del carrito
exports.deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Carrito.deleteProducto(id);
    res.status(200).json({ msg: 'Producto eliminado del carrito', producto });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ msg: 'Error al eliminar producto del carrito' });
  }
};

exports.vaciarCarrito = async (req, res) => {
  const { cliente_id } = req.body;

  if (!cliente_id) {
    return res.status(400).json({ msg: "Falta el cliente_id" });
  }

  try {
    // Obtener los productos del carrito
    const carritoProductos = await Carrito.getByClienteId(cliente_id);

    // Obtener stock actual antes de restarlo
    for (const item of carritoProductos) {
      const producto = await Product.getById(item.producto_id); // Obtener el stock actual
      if (producto) {
        const nuevoStock = producto.stock + item.cantidad; // Restablecer stock
        await Product.updateStock(item.producto_id, nuevoStock);
      }
    }

    // Vaciar el carrito
    await Carrito.vaciarCarrito(cliente_id);
    res.status(200).json({ msg: "Carrito vacío correctamente" });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error.message);
    res.status(500).json({ msg: "Error al vaciar el carrito" });
  }
};

exports.finalizarCompra = async (req, res) => {
  const { cliente_id } = req.body;

  if (!cliente_id) {
    return res.status(400).json({ msg: "Falta el cliente_id." });
  }

  try {
    // Obtener productos en el carrito
    const carritoProductos = await Carrito.getByClienteId(cliente_id);

    if (carritoProductos.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío." });
    }

    // Verificar y actualizar stock para cada producto
    for (const item of carritoProductos) {
      const producto = await Product.getById(item.producto_id); // Obtener producto
      if (!producto) {
        return res.status(404).json({ msg: `El producto con ID ${item.producto_id} no existe.` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          msg: `El producto "${producto.nombre}" no tiene suficiente stock. Disponible: ${producto.stock}.`,
        });
      }

      // Reducir el stock del producto
      await Product.updateStock(item.producto_id, producto.stock - item.cantidad);
    }

    // Vaciar el carrito del cliente
    await Carrito.vaciarCarrito(cliente_id);

    res.status(200).json({ msg: "Compra finalizada con éxito." });
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    res.status(500).json({ msg: "Error al finalizar la compra." });
  }
};

