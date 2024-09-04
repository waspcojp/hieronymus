import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
	class SubAccount extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Account, {
				foreignKey: 'accountId',
				onDelete: 'CASCADE'
			});
		}
	};
	SubAccount.init({
		name: DataTypes.STRING,
		key: DataTypes.STRING,
		accountId: DataTypes.INTEGER,
		subAccountCode: DataTypes.INTEGER,
		taxClass: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'SubAccount',
	});
	return SubAccount;
};
