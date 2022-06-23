'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
	  const now = new Date();
      await queryInterface.bulkInsert('FiscalYears', [{
		  startDate: new Date("2022-04-01"),
		  endDate: new Date("2023-03-31"),
		  term: 1,
      year: 2022,
		  createdAt: now,
		  updatedAt: now
	  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
	  await queryInterface.bulkDelete('FiscalYears', null, {});
  }
};
