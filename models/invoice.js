'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			this.hasOne(models.Customer, {
				foreignKey: 'id',
				sourceKey: 'customerId'
			});
    }
  }
  Invoice.init({
    no: DataTypes.STRING,
    status: DataTypes.INTEGER,
		lineCount: DataTypes.INTEGER,
    term: DataTypes.INTEGER,
    issueDate: DataTypes.DATEONLY,
    paymentDate: DataTypes.DATEONLY,
    customerId: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    paymentMethod: DataTypes.INTEGER,
    delivery: DataTypes.STRING,
    expiration: DataTypes.STRING,
    amount: DataTypes.DECIMAL(12),
    tax: DataTypes.DECIMAL(12),
    taxClass: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};