import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.ItemClass, {
        foreignKey: 'id',
        sourceKey: 'itemClassId',
        as: 'itemClass',
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
      this.hasMany(models.ItemFile, {
        foreignKey: 'itemId',
        as: 'files'
      })
    }
  }
  Item.init({
    itemClassId: DataTypes.INTEGER,
    key: DataTypes.STRING,
    globalCode: DataTypes.STRING,         //  JAN, ASIN, ISBN...
    storageCode: DataTypes.STRING,        //  FNSKU, 棚番号...
    localCode: DataTypes.STRING,          //  
    name: DataTypes.STRING,               //  一般名
    normalName: DataTypes.STRING,         //  正式名
    spec: DataTypes.STRING,               //  仕様
    standardPrice: DataTypes.DECIMAL(8),  //  標準価格
    costPrice: DataTypes.DECIMAL(8),      //  原価
    unit: DataTypes.STRING,
    taxClass: DataTypes.INTEGER,
    descriptionType: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};