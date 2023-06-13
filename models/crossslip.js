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
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'createdBy',
				as: 'creater'
			});
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'approvedBy',
				as: 'approver'
			});
		}
	};
	CrossSlip.init({
		year: DataTypes.INTEGER,
		month: DataTypes.INTEGER,
		day: DataTypes.INTEGER,
		no: DataTypes.INTEGER,
		lineCount: DataTypes.INTEGER,
		term: DataTypes.INTEGER,
		approvedAt: DataTypes.DATE,
		approvedBy: DataTypes.INTEGER,
		createdBy: DataTypes.INTEGER,
		updatedBy: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'CrossSlip',
	});
	return CrossSlip;
};
