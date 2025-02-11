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
  const { cliente_id, membresia_id, producto_id, cantidad } = req.body;

  if (!cliente_id || (!membresia_id && !producto_id)) {
    return res.status(400).json({ msg: "Datos inválidos para añadir al carrito" });
  }

  try {
    if (membresia_id) {
      // Verificar si el usuario ya tiene una membresía activa en los últimos 30 días
      const checkMembership = await pool.query(
        `SELECT * FROM historial_compras 
         WHERE user_id = $1 
         AND membresia_id IS NOT NULL 
         AND fecha >= NOW() - INTERVAL '30 days'`, 
        [cliente_id]
      );

      if (checkMembership.rows.length > 0) {
        return res.status(400).json({ msg: "Ya tienes una membresía activa. No puedes comprar otra hasta que termine el mes." });
      }

      // Si no tiene membresía activa, permitir agregarla al carrito
      const nuevaMembresia = await Carrito.addMembresia(cliente_id, membresia_id);
      return res.status(201).json(nuevaMembresia);
    }

    // Si es un producto, proceder normalmente
    const nuevoItem = await Carrito.addProducto(cliente_id, producto_id, cantidad);
    res.status(201).json(nuevoItem);

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
    // Obtener los productos y membresías en el carrito
    const carritoProductos = await Carrito.getByClienteId(cliente_id);

    if (!carritoProductos || carritoProductos.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío." });
    }

    for (const item of carritoProductos) {
      let total = 0;

      if (item.membresia_id) {
        // Verificar si ya tiene una membresía activa
        const checkMembership = await pool.query(
          `SELECT * FROM historial_compras 
           WHERE user_id = $1 
           AND membresia_id IS NOT NULL 
           AND fecha >= NOW() - INTERVAL '30 days'`, 
          [cliente_id]
        );

        if (checkMembership.rows.length > 0) {
          return res.status(400).json({ msg: "Ya tienes una membresía activa. No puedes comprar otra hasta que termine el mes." });
        }

        const membresia = await Membresia.getById(item.membresia_id);
        if (!membresia) {
          return res.status(404).json({ msg: `La membresía con ID ${item.membresia_id} no existe.` });
        }

        total = membresia.precio;
      } else if (item.producto_id) {
        const producto = await Product.getById(item.producto_id);
        if (!producto) {
          return res.status(404).json({ msg: `El producto con ID ${item.producto_id} no existe.` });
        }
        if (producto.stock < item.cantidad) {
          return res.status(400).json({ msg: `El producto "${producto.nombre}" no tiene suficiente stock.` });
        }

        total = producto.precio * item.cantidad;
        await Product.updateStock(item.producto_id, producto.stock - item.cantidad);
      }

      await pool.query(
        `INSERT INTO historial_compras (user_id, producto_id, membresia_id, cantidad, total, fecha) 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [cliente_id, item.producto_id || null, item.membresia_id || null, item.cantidad || 1, total]
      );
    }

    await Carrito.vaciarCarrito(cliente_id);

    res.status(200).json({ msg: "Compra finalizada con éxito." });
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    res.status(500).json({ msg: "Error interno al finalizar la compra." });
  }
};




