'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Vouchers', 'createdBy', Sequelize.INTEGER);
    await queryInterface.addColumn('Vouchers', 'updatedBy', Sequelize.INTEGER);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vouchers', 'createdBy');
    await queryInterface.removeColumn('Vouchers', 'updatedBy');
  }
};
