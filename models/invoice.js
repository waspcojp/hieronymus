import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			this.hasMany(models.InvoiceDetail, {
				foreignKey: 'invoiceId',
				as: 'lines'
			});
			this.belongsTo(models.Task, {
				sourceKey: 'taskId',
        as: 'task'
			});
			this.belongsTo(models.Customer, {
				sourceKey: 'customerId',
        as: 'customer'
			});
			this.hasOne(models.Document, {
				foreignKey: 'id',
				sourceKey: 'documentId',
        as: 'document'
			});
			this.hasOne(models.Voucher, {
				foreignKey: 'id',
				sourceKey: 'voucherId',
        as: 'voucher'
			});
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'handledBy',
        as: 'handleUser'
			});
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'createdBy',
        as: 'createUser'
			});
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'updatedBy',
        as: 'updateUser'
			});
    }
  }
  Invoice.init({
    no: DataTypes.STRING,
    kind: DataTypes.INTEGER,
    issueDate: DataTypes.DATEONLY,
    deliveryLimit: DataTypes.DATEONLY,
    customerId: DataTypes.INTEGER,
    taskId: DataTypes.INTEGER,
    voucherId: DataTypes.INTEGER,
    customerName: DataTypes.STRING,
    chargeName: DataTypes.STRING,
    zip: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    subject: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
    amount: DataTypes.DECIMAL(12),
    tax: DataTypes.DECIMAL(12),
    taxClass: DataTypes.INTEGER,
    documentId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    handledBy: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};