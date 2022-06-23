'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('AccountRemainings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			accountId: {
				type: Sequelize.INTEGER
			},
			term: {
				type: Sequelize.INTEGER
			},
			debit: {
				type: Sequelize.DECIMAL(12,2)
			},
			credit: {
				type: Sequelize.DECIMAL(12,2)
			},
			balance: {
				type: Sequelize.DECIMAL(12,2)
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE(12,2)
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('AccountRemainings');
	}
};
