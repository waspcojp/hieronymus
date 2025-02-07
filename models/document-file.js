import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class DocumentFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			this.belongsTo(models.Item, {
				foreignKey: 'documentId',
				onDelete: 'CASCADE'
			});
    }
  }
  DocumentFile.init({
    documentId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    body: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'DocumentFile',
  });
  return DocumentFile;
};