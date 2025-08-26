'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sale.belongsTo(models.User, { foreignKey: 'userId' })
      Sale.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  Sale.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    total: DataTypes.FLOAT,
    fecha: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};