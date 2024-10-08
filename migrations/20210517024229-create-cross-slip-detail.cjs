'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('CrossSlipDetails', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			crossSlipId: {
				type: Sequelize.INTEGER,
				refernces: {
					model: 'CrossSlip',
					field: 'id',
				},
				onDelete: "cascade",
				onUpdate: "cascade",
			},
			lineNo: {
				type: Sequelize.INTEGER
			},
			debitAccount: {
				type: Sequelize.STRING
			},
			debitSubAccount: {
				type: Sequelize.INTEGER
			},
			debitAmount: {
				type: Sequelize.DECIMAL(12)
			},
			debitTax: {
				type: Sequelize.DECIMAL(12)
			},
			creditAccount: {
				type: Sequelize.STRING
			},
			creditSubAccount: {
				type: Sequelize.INTEGER
			},
			creditAmount: {
				type: Sequelize.DECIMAL(12)
			},
			creditTax: {
				type: Sequelize.DECIMAL(12)
			},
			application1: {
				type: Sequelize.STRING
			},
			application2: {
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
		await queryInterface.dropTable('CrossSlipDetails');
	}
};
