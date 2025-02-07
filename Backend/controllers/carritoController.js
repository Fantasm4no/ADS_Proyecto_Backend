const Carrito = require('../models/Carrito');
const Product = require("../models/Product");
const Membresia = require("../models/membresias")
const pool = require('../config/db');  // Asegura que se importe la conexión a la base de datos

const jwt = require('jsonwebtoken');

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

    const carrito = await Carrito.getByClienteId(cliente_id);
    res.status(200).json(carrito);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ msg: "Error al obtener el carrito" });
  }
};

exports.addToCarrito = async (req, res) => {
  const { cliente_id, producto_id, membresia_id, cantidad } = req.body;

  if (!cliente_id || (!producto_id && !membresia_id)) {
    return res.status(400).json({ msg: "Datos inválidos para añadir al carrito" });
  }

  try {
    let item;
    if (producto_id) {
      await Product.checkStock(producto_id, cantidad);
      item = await Carrito.addProducto(cliente_id, producto_id, cantidad);
    } else if (membresia_id) {
      item = await Carrito.addMembresia(cliente_id, membresia_id);
    }

    res.status(201).json(item);
  } catch (error) {
    console.error("Error al añadir al carrito:", error.message);
    res.status(400).json({ msg: error.message });
  }
};


// Actualizar cantidad de un producto en el carrito
exports.updateCantidad = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    // Obtener el item del carrito
    const item = await Carrito.getItemById(id);

    if (!item) {
      return res.status(404).json({ msg: "El producto no existe en el carrito." });
    }

    // Si es una membresía, no permitimos actualizar la cantidad
    if (item.membresia_id) {
      return res.status(400).json({ msg: "No puedes modificar la cantidad de una membresía." });
    }

    // Si es un producto, actualizar la cantidad
    const productoActualizado = await Carrito.updateCantidad(id, cantidad);
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({ msg: "Error al actualizar cantidad" });
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
    // Obtener productos y membresías en el carrito
    const carritoProductos = await Carrito.getByClienteId(cliente_id);

    if (!carritoProductos || carritoProductos.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío." });
    }

    console.log("Carrito del cliente:", carritoProductos);

    for (const item of carritoProductos) {
      let total = 0;

      if (item.producto_id) {
        // Validar producto
        const producto = await Product.getById(item.producto_id);
        if (!producto) {
          return res.status(404).json({ msg: `El producto con ID ${item.producto_id} no existe.` });
        }
        if (producto.stock < item.cantidad) {
          return res.status(400).json({
            msg: `El producto "${producto.nombre}" no tiene suficiente stock. Disponible: ${producto.stock}.`,
          });
        }

        // Calcular el total para el producto
        total = producto.precio * item.cantidad;

        // Reducir el stock del producto
        await Product.updateStock(item.producto_id, producto.stock - item.cantidad);
      } else if (item.membresia_id) {
        // Validar membresía
        const membresia = await Membresia.getById(item.membresia_id);
        if (!membresia) {
          return res.status(404).json({ msg: `La membresía con ID ${item.membresia_id} no existe.` });
        }
        console.log(`Membresía validada: ${membresia.nombre}`);

        // Calcular el total para la membresía
        total = membresia.precio;
      }

      // Insertar en historial de compras
      const historialQuery = `
          INSERT INTO historial_compras (user_id, producto_id, membresia_id, cantidad, total)
          VALUES ($1, $2, $3, $4, $5)
      `;
      await pool.query(historialQuery, [
          cliente_id,
          item.producto_id || null,
          item.membresia_id || null,
          item.cantidad || 1,  // Si es membresía, cantidad será 1 por defecto
          total  // Asegurar que siempre se inserte un total válido
      ]);
    }

    // Vaciar el carrito después de procesar la compra
    await Carrito.vaciarCarrito(cliente_id);

    res.status(200).json({ msg: "Compra finalizada con éxito." });
  } catch (error) {
    console.error("Error interno al finalizar la compra:", error);
    res.status(500).json({ msg: "Error interno al finalizar la compra." });
  }
};



