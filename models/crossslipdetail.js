import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
	class CrossSlipDetail extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasOne(models.CrossSlip, {
				sourceKey: 'crossSlipId',
				foreignKey: 'id',
				as: 'crossSlip',
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			this.hasOne(models.Voucher, {
				sourceKey: 'debitVoucherId',
				foreignKey: 'id',
				as: 'debitVoucher',
				onDelete: 'SET NULL',
				onUpdate: 'cascade'
			});
			this.hasOne(models.Voucher, {
				sourceKey: 'creditVoucherId',
				foreignKey: 'id',
				as: 'creditVoucher',
				onDelete: 'SET NULL',
				onUpdate: 'cascade'
			});

		}
	};
	CrossSlipDetail.init({
		crossSlipId: DataTypes.INTEGER,
		lineNo: DataTypes.INTEGER,
		debitAccount: DataTypes.STRING,
		debitSubAccount: DataTypes.INTEGER,
		debitAmount: DataTypes.DECIMAL(12),
		debitTax: DataTypes.DECIMAL(12),
		debitVoucherId: DataTypes.INTEGER,
		creditAccount: DataTypes.STRING,
		creditSubAccount: DataTypes.INTEGER,
		creditAmount: DataTypes.DECIMAL(12),
		creditTax: DataTypes.DECIMAL(12),
		creditVoucherId: DataTypes.INTEGER,
		application1: DataTypes.STRING,
		application2: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'CrossSlipDetail',
	});
	return CrossSlipDetail;
};
