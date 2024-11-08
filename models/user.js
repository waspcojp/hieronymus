import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
const NG_NAMES = [
	'admin',
	'manage',
	'manager',
	'root',
	'api',
	'user'
];

import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
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
    get is_live() {
      console.log('is_live', this.deauthorizedAt);
      return  ((( this.deauthorizedAt === null ) || ( this.deauthorizedAt > new Date ())) ? true : false);
    }
    static check(name, password) {
    	if	( NG_NAMES.indexOf(name) >= 0 )	{
        return	new Promise((resolve, reject) => {
          //console.log('invalid name', name);
          reject(`invalid name: '${name}'`);
        });
      } else {
			  return	this.findOne({
				  where: {
				  	name: name },
			  });
		  }
		}
  }
  User.init({
    name: DataTypes.STRING,
    hash_password: DataTypes.STRING,
    deauthorizedAt: DataTypes.DATE,
    accounting: DataTypes.BOOLEAN,
    fiscal_browsing: DataTypes.BOOLEAN,
    approvable: DataTypes.BOOLEAN,
    administrable: DataTypes.BOOLEAN,
    customer_management: DataTypes.BOOLEAN,
    inventory_management: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};