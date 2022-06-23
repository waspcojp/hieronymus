'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
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
      this.hasMany(models.VoucherFile, {
        foreignKey: 'voucherId',
        as: 'files'
      })
    }
  }
  Voucher.init({
    type: DataTypes.INTEGER,
    issueDate: DataTypes.DATEONLY,
    paymentDate: DataTypes.DATEONLY,
    customerId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(12),
    tax: DataTypes.DECIMAL(12),
    taxClass: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};