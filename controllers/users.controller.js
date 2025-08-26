// Gestión de usuarios (lista + cambio de rol) con Sequelize
const { User } = require('../models');

// GET /usuarios  (solo admin en rutas)
async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'rol'],
      order: [['id', 'ASC']]
    });
    return res.json({ status: 200, data: users });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: error.message });
  }
}

// GET /usuarios/:id (solo admin)
async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id', 'nombre', 'email', 'rol'] });
    if (!user) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
    return res.json({ status: 200, data: user });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al obtener usuario', error: error.message });
  }
}

// POST /usuarios (opcional, solo admin)
async function createUser(req, res) {
  const { nombre, email, edad } = req.body;
  try {
    if (!nombre || !email || !edad) return res.status(400).json({ status: 400, message: 'Faltan campos obligatorios' });

    const newUser = await User.create({ nombre, email, edad, rol: 'cliente' });
    return res.status(201).json({ status: 201, data: { id: newUser.id, nombre, email, rol: 'cliente' }, message: 'Usuario creado exitosamente' });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al crear usuario', error: error.message });
  }
}

// PUT /usuarios/:id (opcional, solo admin)
async function updateUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });

    const { nombre, email, edad } = req.body;
    await user.update({
      nombre: nombre ?? user.nombre,
      email:  email  ?? user.email,
      edad:   edad   ?? user.edad
    });

    return res.json({ status: 200, message: 'Usuario editado exitosamente', data: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al editar usuario', error: error.message });
  }
}

// DELETE /usuarios/:id (opcional, solo admin)
async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });

    await user.destroy();
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al eliminar usuario', error: error.message });
  }
}

// ✅ PUT /usuarios/:id/rol (solo admin)
async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body; // esperado: 'admin' | 'moderador' | 'cliente'
  const allowed = ['admin', 'moderador', 'cliente'];

  try {
    if (!allowed.includes(role)) return res.status(400).json({ error: 'Rol invalido' });

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.update({ rol: role });
    return res.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al actualizar rol', error: error.message });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole
};
