import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class TaskDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			this.hasOne(models.Task, {
				sourceKey: 'taskId',
				foreignKey: 'id',
				as: 'task',
				onDelete: 'CASCADE'
			});
			this.hasOne(models.Item, {
				sourceKey: 'itemId',
				foreignKey: 'id',
				as: 'item'
			});
    }
  }
  TaskDetail.init({
    taskId: DataTypes.INTEGER,
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
    modelName: 'TaskDetail',
  });
  return TaskDetail;
};