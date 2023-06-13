'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'deauthorizedAt', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('Users', 'accounting', {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn('Users', 'fiscal_browsing', {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn('Users', 'approvable', {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn('Users', 'administrable', {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn('Users', 'customer_management', {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn('Users', 'inventory_management', {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.sequelize.query(
      'UPDATE "Users" set accounting = true, fiscal_browsing = true, administrable = true, approvable = true, inventory_management = true, customer_management = true where id = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'deauthorizedAt');
    await queryInterface.removeColumn('Users', 'accounting');
    await queryInterface.removeColumn('Users', 'fiscal_browsing');
    await queryInterface.removeColumn('Users', 'approvable');
    await queryInterface.removeColumn('Users', 'administrable');
    await queryInterface.removeColumn('Users', 'customer_management');
    await queryInterface.removeColumn('Users', 'inventory_management');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
