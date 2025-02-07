'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable('InvoiceDetails'); //  drop old table
    await queryInterface.dropTable('Invoices');       //  drop old table
    await queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      issueDate: {
        type: Sequelize.DATEONLY
      },
      title: {
        type: Sequelize.STRING
      },
      descriptionType: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      handledBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
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
    await queryInterface.createTable('DocumentFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      documentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Documents',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      name: {
        type: Sequelize.STRING
      },
      mimeType: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.BLOB
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
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          field: 'id'
        },
        allowNull: true,
        onDelete: 'set null',
        onUpdate: 'cascade'
      },
      issueDate: {
        type: Sequelize.DATEONLY
      },
      deliveryLimit: {
        type: Sequelize.DATEONLY
      },
      customerName: {
        type: Sequelize.STRING
      },
      chargeName: {
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
      subject: {
        type: Sequelize.STRING
      },
      paymentMethod: {
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
      documentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Documents',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      handledBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
      },
      endedAt: {
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
    await queryInterface.createTable('TaskDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      lineNo: {
        type: Sequelize.INTEGER
      },
      itemId: {
        type: Sequelize.INTEGER
      },
      itemName: {
        type: Sequelize.TEXT
      },
      itemSpec: {
        type: Sequelize.TEXT
      },
      unitPrice: {
        type: Sequelize.DECIMAL(12)
      },
      itemNumber: {
        type: Sequelize.DECIMAL(8,2)
      },
      unit: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL(12)
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
      kind: {
        type: Sequelize.INTEGER
      },
      issueDate: {
        type: Sequelize.DATEONLY
      },
      deliveryLimit: {
        type: Sequelize.DATEONLY
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          field: 'id'
        },
        allowNull: true,
        onDelete: 'set null',
        onUpdate: 'cascade'
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks',
          field: 'id'
        },
        allowNull: true,
        onDelete: 'set null',
        onUpdate: 'cascade'
      },
      customerName: {
        type: Sequelize.STRING
      },
      chargeName: {
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
      subject: {
        type: Sequelize.STRING
      },
      paymentMethod: {
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
      documentId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Documents',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      voucherId: {
				allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Vouchers',
          field: 'id'
        }
      },
      handledBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'cascade'
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
    await queryInterface.createTable('InvoiceDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoiceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Invoices',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      lineNo: {
        type: Sequelize.INTEGER
      },
      itemId: {
        type: Sequelize.INTEGER
      },
      itemName: {
        type: Sequelize.TEXT
      },
      itemSpec: {
        type: Sequelize.TEXT
      },
      unitPrice: {
        type: Sequelize.DECIMAL(12)
      },
      itemNumber: {
        type: Sequelize.DECIMAL(8,2)
      },
      unit: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL(12)
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

    await queryInterface.addColumn('FiscalYears', 'invoiceCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('FiscalYears', 'invoiceCount');
    await queryInterface.dropTable('InvoiceDetails');
    await queryInterface.dropTable('Invoices');
    await queryInterface.dropTable('TaskDetails');
    await queryInterface.dropTable('Tasks');
    await queryInterface.dropTable('DocumentFiles');
    await queryInterface.dropTable('Documents');
  }
};
