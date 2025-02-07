import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.DocumentFile, {
        foreignKey: 'documentId',
        as: 'files'
      })
    }
  }
  Document.init({
    issueDate: DataTypes.DATEONLY,
    title: DataTypes.STRING,
    descriptionType: DataTypes.STRING,
    description: DataTypes.TEXT,
    handledBy: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Document',
  });
  return Document;
};