'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SubAccountRemainings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subAccountId: {
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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SubAccountRemainings');
  }
};
