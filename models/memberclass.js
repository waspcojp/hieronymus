import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class MemberClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  MemberClass.init({
    title: DataTypes.STRING,
    executive: DataTypes.BOOLEAN,       //  役員
    officer: DataTypes.BOOLEAN,         //  管理職
    fullTime: DataTypes.BOOLEAN,        //  常勤
    insurance: DataTypes.BOOLEAN,       //  給与支給
    socialInsurance: DataTypes.BOOLEAN  //  社会保険等加入
  }, {
    sequelize,
    modelName: 'MemberClass',
  });
  return MemberClass;
};
