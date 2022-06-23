'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('AccountRemainings', 'debit', {
			type: Sequelize.DECIMAL(12)
		});
		await queryInterface.changeColumn('AccountRemainings', 'credit', {
			type: Sequelize.DECIMAL(12)
		});
		await queryInterface.changeColumn('AccountRemainings', 'balance', {
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
