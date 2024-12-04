'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      officialName: {
        type: Sequelize.STRING
      },
      birthDate: {
        type: Sequelize.DATEONLY
      },
      dependent: {
        type: Sequelize.INTEGER
      },
      insuranceNumber: {
        type: Sequelize.STRING
      },
      joiningDate: {
        type: Sequelize.DATEONLY
      },
      resignedDate: {
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addColumn('Users', 'personnelManagement', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.renameColumn('Users', 'hash_password', 'hashPassword');
    await queryInterface.renameColumn('Users', 'fiscal_browsing', 'fiscalBrowsing');
    await queryInterface.renameColumn('Users', 'customer_management', 'customerManagement');
    await queryInterface.renameColumn('Users', 'inventory_management', 'inventoryManagement');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Members');
    await queryInterface.removeColumn('Users', 'personnelManagement');
    await queryInterface.renameColumn('Users', 'hashPassword', 'hash_password');
    await queryInterface.renameColumn('Users', 'fiscalBrowsing', 'fiscal_browsing');
    await queryInterface.renameColumn('Users', 'customerManagement', 'customer_management');
    await queryInterface.renameColumn('Users', 'inventoryManagement', 'inventory_management');
  }
};