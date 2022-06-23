'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class AccountClass extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.Account, {
				foreignKey: 'accountClassId',
				sourceKey: 'id'
			});
		}
	};
	AccountClass.init({
		major: DataTypes.STRING,
		middle: DataTypes.STRING,
		minor: DataTypes.STRING,
		field: DataTypes.INTEGER,
		adding: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'AccountClass',
	});
	return AccountClass;
};
