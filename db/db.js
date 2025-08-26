// Conexión a MySQL con Sequelize
// Variables en inglés; comentarios en español
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('crud_db', 'root', 'root1234', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // desactiva logs SQL
});

module.exports = sequelize;
