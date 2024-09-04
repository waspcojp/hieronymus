import {Model} from 'sequelize';

export default (sequelize, DataTypes) => {
	class FiscalYear extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	};
	FiscalYear.init({
		startDate: DataTypes.DATE,
		endDate: DataTypes.DATE,
		term: DataTypes.INTEGER,
		year: DataTypes.INTEGER,
		taxIncluded: DataTypes.BOOLEAN
	}, {
		sequelize,
		modelName: 'FiscalYear',
	});
	return FiscalYear;
};
