/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
    await queryInterface.createTable('ItemClasses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      product: {
        type: Sequelize.BOOLEAN
      },
      inventoryManagement: {
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
    await queryInterface.bulkInsert('ItemClasses', [
      {
        name: 'サービス(無形物)',
        product: true,
        inventoryManagement: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '商品(有形物)',
        product: true,
        inventoryManagement: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      itemClassId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING
      },
      globalCode: {
        type: Sequelize.STRING
      },
      storageCode: {
        type: Sequelize.STRING
      },
      localCode: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      normalName: {
        type: Sequelize.STRING
      },
      spec: {
        type: Sequelize.STRING
      },
      standardPrice: {
        type: Sequelize.DECIMAL(8)
      },
      costPrice: {
        type: Sequelize.DECIMAL(8)
      },
      unit: {
        type: Sequelize.STRING
      },
      taxClass: {
        type: Sequelize.INTEGER
      },
      descriptionType: {
        type: Sequelize.STRING
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
    await queryInterface.addConstraint('Items', {
      fields: ['itemClassId'],
      type: 'foreign key',
      name: 'Items_itemClassId_fkey',
      references: {
        table: 'ItemClasses',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'RESTRICT'
    });
    await queryInterface.createTable('ItemFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      itemId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Items',
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
    /*  product -> item */
    await queryInterface.renameColumn('InvoiceDetails', 'productId', 'itemId');
    await queryInterface.changeColumn('InvoiceDetails', 'itemNumber', {
      type: Sequelize.DECIMAL(8,2)
    });
    await queryInterface.removeColumn('InvoiceDetails', 'tax');
    await queryInterface.removeColumn('InvoiceDetails', 'taxClass');
    await queryInterface.removeColumn('InvoiceDetails', 'productName');
    await queryInterface.addColumn('InvoiceDetails', 'itemName', {
      type: Sequelize.STRING
    });
    await queryInterface.removeColumn('InvoiceDetails', 'productDetail');
    await queryInterface.addColumn('InvoiceDetails', 'itemSpec', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('InvoiceDetails', 'unit', {
      type: Sequelize.STRING
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      spec: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      unit: {
        type: Sequelize.STRING
      },
      unitPrice: {
        type: Sequelize.DECIMAL(12)
      },
      tax: {
        type: Sequelize.DECIMAL(12)
      },
      taxClass: {
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
    await queryInterface.dropTable('ItemFiles');
    await queryInterface.dropTable('Items');
    await queryInterface.dropTable('ItemClasses');
    /*  item -> product */
    await queryInterface.renameColumn('InvoiceDetails', 'itemId', 'productId');
    await queryInterface.changeColumn('InvoiceDetails', 'itemNumber', {
      type: Sequelize.DECIMAL(12)
    });
    await queryInterface.renameColumn('InvoiceDetails', 'itemName', 'productName');
    await queryInterface.renameColumn('InvoiceDetails', 'itemSpec', 'productDetail');
    await queryInterface.removeColumn('InvoiceDetails', 'unit');
    await queryInterface.addColumn('InvoiceDetails', 'tax', {
      type: Sequelize.DECIMAL(12)
    });
    await queryInterface.addColumn('InvoiceDetails', 'taxClass', {
      type: Sequelize.INTEGER
    });
}
};