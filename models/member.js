'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  member.init({
    userId: DataTypes.INTEGER,
    officialName: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    dependent: DataTypes.INTEGER,
    insuranceNumber: DataTypes.STRING,
    joiningDate: DataTypes.DATEONLY,
    resignedDate: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};