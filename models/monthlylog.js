import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class MonthlyLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  MonthlyLog.init({
    term: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    slipCount: DataTypes.INTEGER,
    voucherCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MonthlyLog',
  });
  return MonthlyLog;
};
