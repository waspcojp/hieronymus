'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
		await queryInterface.createTable('AccountClasses', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			major: {
				type: Sequelize.STRING
			},
			middle: {
				type: Sequelize.STRING
			},
			minor: {
				type: Sequelize.STRING
			},
			field: {
				type: Sequelize.INTEGER
			},
			adding: {
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
		await queryInterface.createTable('Accounts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			key: {
				type: Sequelize.STRING
			},
			accountClassId: {
				type: Sequelize.INTEGER
			},
			accountCode: {
				allowNull: false,
				type: Sequelize.STRING
			},
			taxClass: {
				type: Sequelize.INTEGER
			},
			subAccountCount: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			expiredAt: {
				type: Sequelize.DATE
			}
		});
		await queryInterface.createTable('SubAccounts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			key: {
				type: Sequelize.STRING
			},
			accountId: {
				type: Sequelize.INTEGER
			},
			subAccountCode: {
				type: Sequelize.INTEGER
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
		await queryInterface.createTable('AccountRemainings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			accountId: {
				type: Sequelize.INTEGER
			},
			term: {
				type: Sequelize.INTEGER
			},
			debit: {
				type: Sequelize.DECIMAL(12)
			},
			credit: {
				type: Sequelize.DECIMAL(12)
			},
			balance: {
				type: Sequelize.DECIMAL(12)
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
    await queryInterface.createTable('SubAccountRemainings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subAccountId: {
        type: Sequelize.INTEGER
      },
      term: {
        type: Sequelize.INTEGER
      },
      debit: {
        type: Sequelize.DECIMAL(12)
      },
      credit: {
        type: Sequelize.DECIMAL(12)
      },
      balance: {
        type: Sequelize.DECIMAL(12)
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
	await queryInterface.createTable('CrossSlips', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
      term: {
				type: Sequelize.INTEGER
      },
			year: {
				type: Sequelize.INTEGER
			},
			month: {
				type: Sequelize.INTEGER
			},
			day: {
				type: Sequelize.INTEGER
			},
			no: {
				type: Sequelize.INTEGER
			},
			lineCount: {
				type: Sequelize.INTEGER
			},
			key: {
				type: Sequelize.STRING
			},
			approvedBy: {
				type: Sequelize.INTEGER
			},
			createdBy: {
				type: Sequelize.INTEGER
			},
			updatedBy: {
				type: Sequelize.INTEGER
			},
			approvedAt: {
				type: Sequelize.DATE
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
	await queryInterface.createTable('CrossSlipDetails', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			crossSlipId: {
				type: Sequelize.INTEGER,
				refernces: {
					model: 'CrossSlip',
					field: 'id',
				},
				onDelete: "cascade",
				onUpdate: "cascade",
			},
			lineNo: {
				type: Sequelize.INTEGER
			},
			debitAccount: {
				type: Sequelize.STRING
			},
			debitSubAccount: {
				type: Sequelize.INTEGER
			},
			debitAmount: {
				type: Sequelize.DECIMAL(12)
			},
			debitTax: {
				type: Sequelize.DECIMAL(12)
			},
      debitVoucherId: {
				type: Sequelize.INTEGER
      },
			creditAccount: {
				type: Sequelize.STRING
			},
			creditSubAccount: {
				type: Sequelize.INTEGER
			},
			creditAmount: {
				type: Sequelize.DECIMAL(12)
			},
			creditTax: {
				type: Sequelize.DECIMAL(12)
			},
      creditVoucherId: {
				type: Sequelize.INTEGER
      },
			application1: {
				type: Sequelize.STRING
			},
			application2: {
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
    await queryInterface.createTable('FiscalYears', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      term: {
        type: Sequelize.INTEGER
      },
	  year: {
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
		await queryInterface.createTable('MonthlyLogs', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			term: {
				type: Sequelize.INTEGER
			},
			month: {
				type: Sequelize.INTEGER
			},
			slipCount: {
				type: Sequelize.INTEGER
			},
			voucherCount: {
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
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      hash_password: {
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
    await queryInterface.createTable('Vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
			issueDate: {
        allowNull: false,
				type: Sequelize.DATEONLY
			},
			paymentDate: {
				type: Sequelize.DATEONLY
			},
			customerId: {
				type: Sequelize.INTEGER
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
    await queryInterface.createTable('VoucherFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voucherId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Vouchers',
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('VoucherFiles');
    await queryInterface.dropTable('Vouchers');
    await queryInterface.dropTable('Customers');
    await queryInterface.dropTable('Users');
		await queryInterface.dropTable('MonthlyLogs');
		await queryInterface.dropTable('FiscalYears');
		await queryInterface.dropTable('CrossSlipDetails');
		await queryInterface.dropTable('CrossSlips');
		await queryInterface.dropTable('SubAccountRemainings');
		await queryInterface.dropTable('AccountRemainings');
		await queryInterface.dropTable('SubAccounts');
		await queryInterface.dropTable('Accounts');
		await queryInterface.dropTable('AccountClasses');
  }
};
