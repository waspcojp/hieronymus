'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('CrossSlips', 'approvedAt', Sequelize.DATE);
    await queryInterface.addColumn('CrossSlips', 'approvedBy', Sequelize.INTEGER);
    await queryInterface.addColumn('CrossSlips', 'createdBy', Sequelize.INTEGER);
    await queryInterface.addColumn('CrossSlips', 'updatedBy', Sequelize.INTEGER);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('CrossSlips', 'approvedAt');
    await queryInterface.removeColumn('CrossSlips', 'approvedBy');
    await queryInterface.removeColumn('CrossSlips', 'createdBy');
    await queryInterface.removeColumn('CrossSlips', 'updatedBy');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
