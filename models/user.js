'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model  {
    static  associate(models) {
      // associations can be defined here
    }
  };
  User.init({
    name: DataTypes.STRING,
    hash_password: DataTypes.STRING,
    approvable: DataTypes.BOOLEAN,
    administratable: DataTypes.BOOLEAN,
    inventory: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};