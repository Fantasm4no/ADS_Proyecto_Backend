const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos" });
  }
};

exports.createProduct = async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    const product = await Product.create(nombre, descripcion, precio, stock);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ msg: "Error al agregar producto" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    const product = await Product.update(id, nombre, descripcion, precio, stock);
    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar producto" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.delete(id);
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar producto" });
  }
};
