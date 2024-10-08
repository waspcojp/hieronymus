'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('SubAccountRemainings', 'debit', {
			type: Sequelize.DECIMAL(12)
		});
		await queryInterface.changeColumn('SubAccountRemainings', 'credit', {
			type: Sequelize.DECIMAL(12)
		});
		await queryInterface.changeColumn('SubAccountRemainings', 'balance', {
			type: Sequelize.DECIMAL(12)
		});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
