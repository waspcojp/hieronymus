'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      term: {
        type: Sequelize.INTEGER
      },
			issueDate: {
        allowNull: false,
				type: Sequelize.DATEONLY
			},
			paymentDate: {
				type: Sequelize.DATEONLY
			},
			customerId: {
				type: Sequelize.INTEGER
			},
			amount: {
				type: Sequelize.DECIMAL(12)
			},
			tax: {
				type: Sequelize.DECIMAL(12)
			},
      taxClass: {
        type: Sequelize.INTEGER
      },
			description: {
				type: Sequelize.TEXT
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
    await queryInterface.addColumn('MonthlyLogs', 'voucherCount', Sequelize.INTEGER);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vouchers');
    await queryInterface.removeColumn('MonthlyLogs', 'voucherCount');
  }
};