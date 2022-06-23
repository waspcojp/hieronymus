'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      chargeName: {
        type: Sequelize.STRING
      },
      ruby: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      address1: {
        type: Sequelize.STRING
      },
      address2: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      key: {
        type: Sequelize.STRING
      },
      closingDate: {
        type: Sequelize.INTEGER
      },
      paymentDate: {
        type: Sequelize.INTEGER
      },
      telNo: {
        type: Sequelize.STRING
      },
      faxNo: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      bankName: {
        type: Sequelize.STRING
      },
      bankBranchName: {
        type: Sequelize.STRING
      },
      accountType: {
        type: Sequelize.STRING
      },
      accountNo: {
        type: Sequelize.STRING
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Customers');
  }
};