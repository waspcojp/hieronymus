import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
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
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'createdBy'
			});
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'updatedBy',
        as: 'update'
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
    invoiceNo: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};