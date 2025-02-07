'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MemberClasses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      executive: {
        type: Sequelize.BOOLEAN
      },
      officer: {
        type: Sequelize.BOOLEAN
      },
      fullTime: {
        type: Sequelize.BOOLEAN
      },
      insurance: {
        type: Sequelize.BOOLEAN
      },
      socialInsurance: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.bulkInsert('MemberClasses', [
      {
        title: '正社員',
        executive: false,
        officer: false,
        fullTime: true,
        insurance: true,
        socialInsurance: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        title: '常勤役員',
        executive: true,
        officer: true,
        fullTime: true,
        insurance: true,
        socialInsurance: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        title: '非常勤役員',
        executive: true,
        officer: false,
        fullTime: false,
        insurance: true,
        socialInsurance: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        title: '管理職',
        executive: false,
        officer: true,
        fullTime: true,
        insurance: true,
        socialInsurance: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        title: 'パートタイマ',
        executive: false,
        officer: false,
        fullTime: false,
        insurance: true,
        socialInsurance: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        title: 'アルバイト',
        executive: false,
        officer: false,
        fullTime: false,
        insurance: true,
        socialInsurance: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        title: '常勤派遣',
        executive: false,
        officer: false,
        fullTime: true,
        insurance: false,
        socialInsurance: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
    await queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: true
      },
      memberClassId: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        references: {
          model: 'MemberClasses',
          field: 'id'
        }
      },
      operation: {
        type: Sequelize.TEXT
      },
      legalName: {
        type: Sequelize.STRING
      },
      legalRuby: {
        type: Sequelize.STRING
      },
      legalSex: {
        type: Sequelize.INTEGER
      },
      tradingName: {
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
      email: {
        type: Sequelize.STRING
      },
      telNo: {
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
      birthDate: {
        type: Sequelize.DATEONLY
      },
      dependent: {
        type: Sequelize.INTEGER
      },
      socialInsuranceNumber: {
        type: Sequelize.STRING
      },
      joiningDate: {
        type: Sequelize.DATEONLY
      },
      resignedDate: {
        type: Sequelize.DATEONLY
      },
      resignReason: {
        type: Sequelize.INTEGER
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
    //  Users changes
    await queryInterface.addColumn('Users', 'personnelManagement', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('Users', 'mail', {
      type: Sequelize.STRING
    });
    await queryInterface.renameColumn('Users', 'hash_password', 'hashPassword');
    await queryInterface.renameColumn('Users', 'fiscal_browsing', 'fiscalBrowsing');
    await queryInterface.renameColumn('Users', 'customer_management', 'customerManagement');
    await queryInterface.renameColumn('Users', 'inventory_management', 'inventoryManagement');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Members');
    await queryInterface.dropTable('MemberClasses');
    await queryInterface.removeColumn('Users', 'personnelManagement');
    await queryInterface.removeColumn('Users', 'mail');
    await queryInterface.renameColumn('Users', 'hashPassword', 'hash_password');
    await queryInterface.renameColumn('Users', 'fiscalBrowsing', 'fiscal_browsing');
    await queryInterface.renameColumn('Users', 'customerManagement', 'customer_management');
    await queryInterface.renameColumn('Users', 'inventoryManagement', 'inventory_management');
  }
};