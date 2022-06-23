'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
	  const now = new Date();
	  const term = 1;
	  let data = [];
	  for ( let month = 1; month < 13; month += 1 ) {
		  data.push({
			  term: term,
			  month: month,
			  slipCount: 0,
			  createdAt: now,
			  updatedAt: now
		  });
	  }
      await queryInterface.bulkInsert('MonthlyLogs', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
