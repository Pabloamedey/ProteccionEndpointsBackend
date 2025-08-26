// Registro y login con Sequelize + JWT

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = 'secreto1234'; // ⚠️ en prod usar variable de entorno

// POST /auth/register
async function register(req, res) {
  const { nombre, email, edad, password, rol } = req.body;

  try {
    const userExist = await User.findOne({ where: { email } });
    if (userExist) return res.status(400).json({ message: 'El usuario ya existe' });

    // hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      email,
      edad,
      password: hashedPassword,
      rol: rol || 'cliente'
    });

    // ⚠️ no enviar password al frontend
    const safeUser = { id: newUser.id, name: newUser.nombre, email: newUser.email, role: newUser.rol };

    // firmar token con shape consistente
    const token = jwt.sign({ id: safeUser.id, email: safeUser.email, role: safeUser.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ message: 'Usuario registrado', token, user: safeUser });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al crear el usuario', error: error.message });
  }
}

// POST /auth/login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(403).json({ message: 'Contraseña incorrecta' });

    const safeUser = { id: user.id, name: user.nombre, email: user.email, role: user.rol };
    const token = jwt.sign({ id: safeUser.id, email: safeUser.email, role: safeUser.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ message: 'Inicio de sesión exitoso', token, user: safeUser });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al loguear el usuario', error: error.message });
  }
}

module.exports = { 
  register, 
  login 
};
