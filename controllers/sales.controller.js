// Controlador de ventas con Sequelize (opcionalmente protegido con verifyToken en rutas)
const { Sale, User, Product } = require('..');

async function getAllSales(req, res) {
  try {
    const sales = await Venta.findAll({
      attributes: ['id', 'cantidad', 'total', 'fecha'],
      include: [
        { model: User, attributes: ['nombre', 'email'] },
        { model: Product, attributes: ['nombre', 'precio'] }
      ],
      order: [['id', 'ASC']]
    });
    return res.json({ status: 200, data: sales, message: 'Ventas obtenidas exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al obtener las ventas', error });
  }
}

async function getSaleById(req, res) {
  try {
    const sale = await Sale.findByPk(req.params.id, { include: [Usuario, Producto] });
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
    return res.json({ status: 200, data: sale, message: 'Venta obtenida exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al obtener la venta solicitada', error });
  }
}

async function createSale(req, res) {
  const { userId, productId, cantidad, total, fecha } = req.body;
  try {
    if (!userId || !productId || !cantidad || !total || !fecha) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const newSale = await Sale.create({ userId, productId, cantidad, total, fecha });
    return res.status(201).json({ status: 201, message: 'Venta registrada exitosamente', data: newSale });
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al crear la nueva venta', error });
  }
}

async function updateSale(req, res) {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });

    const { userId, productId, cantidad, total, fecha } = req.body;
    await sale.update({
      userId: userId ?? sale.userId,
      productId: productId ?? sale.productId,
      cantidad: cantidad ?? sale.cantidad,
      total: total ?? sale.total,
      fecha: fecha ?? sale.fecha
    });

    return res.json({ status: 200, message: 'Venta actualizada exitosamente', data: sale });
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al actualizar la venta', error });
  }
}

async function deleteSale(req, res) {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });

    await sale.destroy();
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al eliminar la venta', error });
  }
}

module.exports = { 
  getAllSales, 
  getSaleById, 
  createSale, 
  updateSale, 
  deleteSale 
};
