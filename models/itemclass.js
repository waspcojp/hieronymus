import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class ItemClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Item, {
        foreignKey: 'itemClassId',
        sourceKey: 'id',
        as: 'items',
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    }
  };
  ItemClass.init({
    name: DataTypes.STRING,
    product: DataTypes.BOOLEAN,
    inventoryManagement: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ItemClass',
  });
  return ItemClass;
};
