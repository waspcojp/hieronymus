'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Invoices', 'name');
    await queryInterface.removeColumn('Invoices', 'status');
    await queryInterface.removeColumn('Invoices', 'delivery');
    await queryInterface.removeColumn('Invoices', 'lineCount');
    await queryInterface.addColumn('FiscalYears', 'invoiceCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('Invoices', 'customerName', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Invoices', 'chargeName', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Invoices', 'expiringDate', {
      type: Sequelize.DATEONLY
    });
    await queryInterface.addColumn('Invoices', 'billingDate', {
      type: Sequelize.DATEONLY
    });
    await queryInterface.addColumn('Invoices', 'deliveryDate', {
      type: Sequelize.DATEONLY
    });
    await queryInterface.addColumn('Invoices', 'orderedDate', {
      type: Sequelize.DATEONLY
    });
    await queryInterface.addColumn('Invoices', 'handledBy', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('Invoices', 'createdBy', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('Invoices', 'updatedBy', {
      type: Sequelize.INTEGER
    });
    await queryInterface.changeColumn('Invoices', 'paymentMethod', {
      type: Sequelize.STRING
    });
    await queryInterface.addConstraint('Invoices', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'Invoices_customerId_fkey',
      references: {
        table: 'Customers',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Invoices', {
      fields: ['handledBy'],
      type: 'foreign key',
      name: 'Invoices_handledBy_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Invoices', {
      fields: ['createdBy'],
      type: 'foreign key',
      name: 'Invoices_createdBy_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Invoices', {
      fields: ['updatedBy'],
      type: 'foreign key',
      name: 'Invoices_updatedBy_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Invoices', 'name', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Invoices', 'status', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('Invoices', 'delivery', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Invoices', 'lineCount', {
      type: Sequelize.INTEGER
    });
    await queryInterface.removeConstraint('Invoices', 'Invoices_customerId_fkey');
    await queryInterface.removeConstraint('Invoices', 'Invoices_handledBy_fkey');
    await queryInterface.removeConstraint('Invoices', 'Invoices_createdBy_fkey');
    await queryInterface.removeConstraint('Invoices', 'Invoices_updatedBy_fkey');
    await queryInterface.removeColumn('Invoices', 'customerName');
    await queryInterface.removeColumn('Invoices', 'chargeName');
    await queryInterface.removeColumn('Invoices', 'expiringDate');
    await queryInterface.removeColumn('Invoices', 'billingDate');
    await queryInterface.removeColumn('Invoices', 'deliveryDate');
    await queryInterface.removeColumn('Invoices', 'orderedDate');
    await queryInterface.removeColumn('Invoices', 'handledBy');
    await queryInterface.removeColumn('Invoices', 'createdBy');
    await queryInterface.removeColumn('Invoices', 'updatedBy');
    await queryInterface.removeColumn('FiscalYears', 'invoiceCount');
  }
};
