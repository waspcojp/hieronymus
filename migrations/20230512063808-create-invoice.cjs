'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      no: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
			lineCount: {
				type: Sequelize.INTEGER
			},
      term: {
        type: Sequelize.INTEGER
      },
      issueDate: {
        type: Sequelize.DATEONLY
      },
      paymentDate: {
        type: Sequelize.DATEONLY
      },
      customerId: {
        type: Sequelize.INTEGER
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
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      paymentMethod: {
        type: Sequelize.INTEGER
      },
      delivery: {
        type: Sequelize.STRING
      },
      expiration: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL(12)
      },
      tax: {
        type: Sequelize.DECIMAL(12)
      },
      taxClass: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Invoices');
  }
};