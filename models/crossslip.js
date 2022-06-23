'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class CrossSlip extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.CrossSlipDetail, {
				foreignKey: 'crossSlipId',
				sourceKey: 'id',
				as: 'lines'
			});
		}
	};
	CrossSlip.init({
		year: DataTypes.INTEGER,
		month: DataTypes.INTEGER,
		day: DataTypes.INTEGER,
		no: DataTypes.INTEGER,
		lineCount: DataTypes.INTEGER,
		term: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'CrossSlip',
	});
	return CrossSlip;
};
