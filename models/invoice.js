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
				sourceKey: 'id',
				as: 'lines'
			});
			this.hasOne(models.Customer, {
				foreignKey: 'id',
				sourceKey: 'customerId',
        as: 'customer'
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
    term: DataTypes.INTEGER,
    issueDate: DataTypes.DATEONLY,
    expiringDate: DataTypes.DATEONLY,
    orderedDate: DataTypes.DATEONLY,
    deliveryDate: DataTypes.DATEONLY,
    billingDate: DataTypes.DATEONLY,
    paymentDate: DataTypes.DATEONLY,
    customerId: DataTypes.INTEGER,
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