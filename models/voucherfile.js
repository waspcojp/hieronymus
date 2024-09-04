import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class VoucherFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			this.belongsTo(models.Voucher, {
				foreignKey: 'voucherId',
				onDelete: 'CASCADE'
			});
    }
  }
  VoucherFile.init({
    voucherId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    body: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'VoucherFile',
  });
  return VoucherFile;
};