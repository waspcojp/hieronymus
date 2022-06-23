'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('CrossSlipDetails', 'debitVoucherId', Sequelize.INTEGER);
    await queryInterface.addColumn('CrossSlipDetails', 'creditVoucherId', Sequelize.INTEGER);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('CrossSlipDetails', 'debitVoucherId');
    await queryInterface.removeColumn('CrossSlipDetails', 'creditVoucherId');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
