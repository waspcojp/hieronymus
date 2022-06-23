'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('FiscalYears', 'year', Sequelize.INTEGER);
  },

  down: async (queryInterface, Sequelize) => {
  }
};
