import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.MemberClass, {
        foreignKey: 'id',
        sourceKey: 'memberClassId',
        as: 'memberClass'
      });
      this.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'userId',
        as: 'user'
      });
    }
  }
  Member.init({
    userId: DataTypes.INTEGER,
    memberClassId: DataTypes.INTEGER,
    operation: DataTypes.TEXT,

    legalName: DataTypes.STRING,
    legalRuby: DataTypes.STRING,
    legalSex: DataTypes.INTEGER,
    tradingName: DataTypes.STRING,
    zip: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    email: DataTypes.STRING,
    telNo: DataTypes.STRING,

    bankName: DataTypes.STRING,
    bankBranchName: DataTypes.STRING,
    accountType: DataTypes.STRING,
    accountNo: DataTypes.STRING,

    birthDate: DataTypes.DATEONLY,
    dependent: DataTypes.INTEGER,
    socialInsuranceNumber: DataTypes.STRING,
    joiningDate: DataTypes.DATEONLY,
    resignedDate: DataTypes.DATEONLY,
    resignReason: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};