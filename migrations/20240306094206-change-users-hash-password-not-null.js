'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'hash_password', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'hash_password', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
