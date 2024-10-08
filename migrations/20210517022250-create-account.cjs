'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Accounts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			key: {
				type: Sequelize.STRING
			},
			accountClassId: {
				type: Sequelize.INTEGER
			},
			accountCode: {
				allowNull: false,
				type: Sequelize.STRING
			},
			taxClass: {
				type: Sequelize.INTEGER
			},
			subAccountCount: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			expiredAt: {
				type: Sequelize.DATE
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Accounts');
	}
};
