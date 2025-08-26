// CRUD de productos con Sequelize
const { Product } = require('../models');

// GET /productos
async function getProducts(req, res) {
  try {
    const products = await Product.findAll({ order: [['id', 'ASC']] });
    return res.json({ data: products, status: 200, message: 'Productos obtenidos exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener productos' });
  }
}

// GET /productos/:id
async function getProductById(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    return res.json({ data: product, status: 200, message: 'Producto encontrado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar el producto' });
  }
}

// POST /productos  (solo admin en rutas)
async function createProduct(req, res) {
  const nombre = req.body.nombre ?? req.body.name;
  const precio = req.body.precio ?? req.body.price;

  try {
    if (!nombre || precio == null) return res.status(400).json({ message: 'Faltan datos obligatorios' });
    const newProduct = await Product.create({ nombre, precio: Number(precio) });
    return res.status(201).json({ status: 201, data: newProduct, message: 'Producto creado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al crear el producto' });
  }
}

// PUT /productos/:id  (solo admin)
async function updateProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ status: 404, message: 'Producto no encontrado' });

    const nombre = req.body.nombre ?? req.body.name ?? product.nombre;
    const precio = req.body.precio ?? req.body.price ?? product.precio;

    await product.update({ nombre, precio });
    return res.json({ status: 200, message: 'Producto editado exitosamente', data: product });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al editar producto', error: error.message });
  }
}

// DELETE /productos/:id  (solo admin)
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ status: 404, message: 'Producto no encontrado' });

    await product.destroy();
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al eliminar producto', error: error.message });
  }
}

module.exports = { getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};
