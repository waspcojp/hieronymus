import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
	class AccountRemaining extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	};
	AccountRemaining.init({
		accountId: DataTypes.INTEGER,
		term: DataTypes.INTEGER,
		debit: DataTypes.DECIMAL(12),
		credit: DataTypes.DECIMAL(12),
		balance: DataTypes.DECIMAL(12)
	}, {
		sequelize,
		modelName: 'AccountRemaining',
	});
	return AccountRemaining;
};
