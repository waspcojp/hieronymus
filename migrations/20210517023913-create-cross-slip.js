'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('CrossSlips', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			year: {
				type: Sequelize.INTEGER
			},
			month: {
				type: Sequelize.INTEGER
			},
			day: {
				type: Sequelize.INTEGER
			},
			no: {
				type: Sequelize.INTEGER
			},
			lineCount: {
				type: Sequelize.INTEGER
			},
			key: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('CrossSlips');
	}
};
