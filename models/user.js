'use strict';
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model  {
    static  associate(models) {
      // associations can be defined here
    }
    set password(p) {
      this.hash_password = bcrypt.hashSync(p, SALT_ROUNDS);
    }
    get password() {
      return (this.hash_password);
    }
    static check(name) {
      this.findOne({
        where: {
          name: name },
      }).then((user) => {
        return (user ? true : false);
      });
    }
    };
  User.init({
    name: DataTypes.STRING,
    hash_password: DataTypes.STRING,
    deauthorizedAt: DataTypes.DATE,
    accounting: DataTypes.BOOLEAN,
    fiscal_browsing: DataTypes.BOOLEAN,
    approvable: DataTypes.BOOLEAN,
    administrable: DataTypes.BOOLEAN,
    inventory: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};