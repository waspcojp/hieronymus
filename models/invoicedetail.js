import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class InvoiceDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			this.hasOne(models.Invoice, {
				sourceKey: 'invoiceId',
				foreignKey: 'id',
				as: 'invoice',
				onDelete: 'CASCADE'
			});
			this.hasOne(models.Item, {
				sourceKey: 'itemId',
				foreignKey: 'id',
				as: 'item'
			});
    }
  }
  InvoiceDetail.init({
    invoiceId: DataTypes.INTEGER,
    lineNo: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    itemName: DataTypes.TEXT,
    itemSpec: DataTypes.TEXT,
    unitPrice: DataTypes.DECIMAL(12),
    itemNumber: DataTypes.DECIMAL(8,2),
    unit: DataTypes.STRING,
    amount: DataTypes.DECIMAL(12),
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'InvoiceDetail',
  });
  return InvoiceDetail;
};