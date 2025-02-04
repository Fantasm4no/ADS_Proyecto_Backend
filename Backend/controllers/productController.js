const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    console.log("Productos obtenidos desde la base de datos:", products); // Log para confirmar
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ msg: "Error al obtener productos" });
  }
};

exports.createProduct = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, admin_id } = req.body;
  try {
    if (!admin_id) {
      return res.status(400).json({ msg: "El admin_id es obligatorio" });
    }
    const product = await Product.create(nombre, descripcion, precio, stock, imagen_url, admin_id);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ msg: "Error al agregar producto" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body; // Solo necesitamos el stock para este caso
  try {
    const updatedProduct = await Product.updateStock(id, stock);
    if (!updatedProduct) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    res.status(500).json({ msg: "Error al actualizar el stock" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productoCarrito = await Carrito.getById(id);
    if (!productoCarrito) {
      return res.status(404).json({ msg: "Producto no encontrado en el carrito" });
    }

    // Recuperar stock actual
    const producto = await Product.getById(productoCarrito.producto_id);
    if (producto) {
      await Product.updateStock(productoCarrito.producto_id, producto.stock + productoCarrito.cantidad);
    }

    await Carrito.deleteProduct(id);
    res.status(200).json({ msg: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ msg: 'Error al eliminar producto del carrito' });
  }
};
