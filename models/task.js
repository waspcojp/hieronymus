import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			this.hasMany(models.TaskDetail, {
				foreignKey: 'taskId',
				as: 'lines'
			});
			this.belongsTo(models.Customer, {
				sourceKey: 'customerId',
        as: 'customer'
			});
			this.hasMany(models.Invoice, {
				foreignKey: 'taskId',
				sourceKey: 'id',
				as: 'invoices'
			});
			this.hasOne(models.Document, {
				foreignKey: 'id',
				sourceKey: 'documentId',
        as: 'document'
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
  Task.init({
    issueDate: DataTypes.DATEONLY,
    deliveryLimit: DataTypes.DATEONLY,
    endedAt: DataTypes.DATEONLY,
    customerId: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
    amount: DataTypes.DECIMAL(12),
    tax: DataTypes.DECIMAL(12),
    taxClass: DataTypes.INTEGER,
    documentId: DataTypes.INTEGER,
    customerName: DataTypes.STRING,
    chargeName: DataTypes.STRING,
    zip: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    handledBy: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};