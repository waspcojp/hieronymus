'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    type: DataTypes.INTEGER,
    name: DataTypes.STRING,
    chargeName: DataTypes.STRING,
    ruby: DataTypes.STRING,
    zip: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    description: DataTypes.TEXT,
    key: DataTypes.STRING,
    closingDate: DataTypes.INTEGER,
    paymentDate: DataTypes.INTEGER,
    telNo: DataTypes.STRING,
    faxNo: DataTypes.STRING,
    email: DataTypes.STRING,
    url: DataTypes.STRING,
    bankName: DataTypes.STRING,
    bankBranchName: DataTypes.STRING,
    accountType: DataTypes.STRING,
    accountNo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};