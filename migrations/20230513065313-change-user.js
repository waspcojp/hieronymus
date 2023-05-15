'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'approvable', {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.addColumn('Users', 'administrable', {
      type: Sequelize.BOOLEAN
    });
    await queryInterface.sequelize.query('UPDATE "Users" set administrable = true, approvable = true where id = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'approvable');
    await queryInterface.removeColumn('Users', 'administratable');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
