'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Vouchers', 'invoiceNo', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('Customers', 'invoiceNo', {
      type: Sequelize.TEXT
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vouchers', 'invoiceNo');
    await queryInterface.removeColumn('Customers', 'invoiceNo');
    }
};
