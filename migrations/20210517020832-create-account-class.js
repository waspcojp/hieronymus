'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('AccountClasses', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			major: {
				type: Sequelize.STRING
			},
			middle: {
				type: Sequelize.STRING
			},
			minor: {
				type: Sequelize.STRING
			},
			field: {
				type: Sequelize.INTEGER
			},
			adding: {
				type: Sequelize.INTEGER
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
		await queryInterface.dropTable('AccountClasses');
	}
};
