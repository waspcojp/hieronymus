import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
	class CrossSlip extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.CrossSlipDetail, {
				foreignKey: 'crossSlipId',
				as: 'lines'
			});
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'createdBy',
				as: 'creater',
				onDelete: 'RESTRICT',
				onUpdate: 'CASCADE'
			});
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'approvedBy',
				as: 'approver',
				onDelete: 'RESTRICT',
				onUpdate: 'CASCADE'
			});
			this.hasOne(models.User, {
				foreignKey: 'id',
				sourceKey: 'updatedBy',
				as: 'updater',
				onDelete: 'RESTRICT',
				onUpdate: 'CASCADE'
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
