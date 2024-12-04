'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Accounts', {
      fields: ['accountClassId'],
      type: 'foreign key',
      name: 'Accounts_accountClassId_fkey',
      references: {
        table: 'AccountClasses',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('CrossSlipDetails', {
      fields: ['crossSlipId'],
      type: 'foreign key',
      name: 'CrossSlipDetails_crossSlipId_fkey',
      references: {
        table: 'CrossSlips',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('CrossSlipDetails', {
      fields: ['debitVoucherId'],
      type: 'foreign key',
      name: 'CrossSlipDetails_debitVoucherId_fkey',
      references: {
        table: 'Vouchers',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('CrossSlipDetails', {
      fields: ['creditVoucherId'],
      type: 'foreign key',
      name: 'CrossSlipDetails_creditVoucherId_fkey',
      references: {
        table: 'Vouchers',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('CrossSlips', {
      fields: ['createdBy'],
      type: 'foreign key',
      name: 'CrossSlips_createdBy_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('CrossSlips', {
      fields: ['updatedBy'],
      type: 'foreign key',
      name: 'CrossSlips_updatedBy_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('CrossSlips', {
      fields: ['approvedBy'],
      type: 'foreign key',
      name: 'CrossSlips_approvedBy_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('StickyStatuses', {
      fields: ['stickyId'],
      type: 'foreign key',
      name: 'StickyStatuses_stickyId_fkey',
      references: {
        table: 'Stickies',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('StickyStatuses', {
      fields: ['receiverId'],
      type: 'foreign key',
      name: 'StickyStatuses_receiverId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('SubAccounts', {
      fields: ['accountId'],
      type: 'foreign key',
      name: 'SubAccounts_accountId_fkey',
      references: {
        table: 'Accounts',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Vouchers', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'Vouchers_customerId_fkey',
      references: {
        table: 'Customers',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Vouchers', {
      fields: ['createdBy'],
      type: 'foreign key',
      name: 'Vouchers_createdBy_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Vouchers', {
      fields: ['updatedBy'],
      type: 'foreign key',
      name: 'Vouchers_updatedBy_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Accounts', {
      fields: ['accountCode'],
      type: 'unique',
      name: 'Accounts_accountCode_key'
    });
    await queryInterface.addConstraint('AccountRemainings', {
      fields: ['term', 'accountId'],
      type: 'unique',
      name: 'AccountRemainings_term_accountId_key'
    });
    await queryInterface.addConstraint('MonthlyLogs', {
      fields: ['term', 'month'],
      type: 'unique',
      name: 'MonthlyLogs_term_month_key'
    });
    await queryInterface.addConstraint('CrossSlips', {
      fields: ['year', 'month', 'no'],
      type: 'unique',
      name: 'CrossSlips_year_month_no_key'
    });

    await queryInterface.changeColumn('MonthlyLogs', 'term', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('MonthlyLogs', 'month', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('CrossSlips', 'year', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('CrossSlips', 'month', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('CrossSlips', 'day', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('CrossSlips', 'no', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('CrossSlips', 'lineCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Accounts', 'Accounts_accountClassId_fkey');
    await queryInterface.removeConstraint('CrossSlipDetails', 'CrossSlipDetails_crossSlipId_fkey');
    await queryInterface.removeConstraint('CrossSlipDetails', 'CrossSlipDetails_debitVoucherId_fkey');
    await queryInterface.removeConstraint('CrossSlipDetails', 'CrossSlipDetails_creditVoucherId_fkey');
    await queryInterface.removeConstraint('CrossSlips', 'CrossSlips_createdBy_fkey');
    await queryInterface.removeConstraint('CrossSlips', 'CrossSlips_updatedBy_fkey');
    await queryInterface.removeConstraint('CrossSlips', 'CrossSlips_approvedBy_fkey');
    await queryInterface.removeConstraint('StickyStatuses', 'StickyStatuses_stickyId_fkey');
    await queryInterface.removeConstraint('StickyStatuses', 'StickyStatuses_receiverId_fkey');
    await queryInterface.removeConstraint('SubAccounts', 'SubAccounts_accountId_fkey');
    await queryInterface.removeConstraint('Vouchers', 'Vouchers_customerId_fkey');
    await queryInterface.removeConstraint('Vouchers', 'Vouchers_createdBy_fkey');
    await queryInterface.removeConstraint('Vouchers', 'Vouchers_updatedBy_fkey');

    await queryInterface.removeConstraint('Accounts', 'Accounts_accountCode_key');
    await queryInterface.removeConstraint('AccountRemainings', 'AccountRemainings_term_accountId_key');
    await queryInterface.removeConstraint('MonthlyLogs', 'MonthlyLogs_term_month_key');
    await queryInterface.removeConstraint('CrossSlips', 'CrossSlips_year_month_no_key');

    await queryInterface.changeColumn('MonthlyLogs', 'term', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('MonthlyLogs', 'month', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('CrossSlips', 'year', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('CrossSlips', 'month', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('CrossSlips', 'day', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('CrossSlips', 'no', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('CrossSlips', 'lineCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    });
  }
}
