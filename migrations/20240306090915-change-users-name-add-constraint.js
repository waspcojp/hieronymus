'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addConstraint('Users', {
      fields: ['name'],
      type: 'unique',
      name: 'Users_name_uk'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'Users_name_uk');

    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
