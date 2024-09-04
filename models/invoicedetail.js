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
			this.hasOne(models.Product, {
				sourceKey: 'productId',
				foreignKey: 'id',
				as: 'product'
			});
    }
  }
  InvoiceDetail.init({
    invoiceId: DataTypes.INTEGER,
    lineNo: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    productName: DataTypes.TEXT,
    productDetail: DataTypes.TEXT,
    unitPrice: DataTypes.DECIMAL(12),
    itemNumber: DataTypes.DECIMAL(12),
    amount: DataTypes.DECIMAL(12),
    tax: DataTypes.DECIMAL(12),
    taxClass: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'InvoiceDetail',
  });
  return InvoiceDetail;
};