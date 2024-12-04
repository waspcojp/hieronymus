import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class ItemFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			this.belongsTo(models.Item, {
				foreignKey: 'itemId',
				onDelete: 'CASCADE'
			});
    }
  }
  ItemFile.init({
    itemId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    body: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'ItemFile',
  });
  return ItemFile;
};