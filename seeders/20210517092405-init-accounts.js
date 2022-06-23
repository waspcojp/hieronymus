'use strict';

const values = require('../libs/parse_accounts');
const fs = require('fs');

const {AccountClass,Account, AccountRemaining, SubAccount, SubAccountRemaining}= require('../models');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const now = new Date();
		let account_classes = [];
		values.account_classes.forEach((account_class) => {
			account_classes.push({
				major: account_class.major,
				middle: account_class.middle,
				minor: account_class.minor,
				field: account_class.field,
				adding: account_class.adding,
				createdAt: now,
				updatedAt: now
			});
		});
		await queryInterface.bulkInsert('AccountClasses', account_classes , {});
		account_classes = await AccountClass.findAll();
		for ( let i = 0; i < values.accounts.length; i ++ ) {
			let account = values.accounts[i];
			let account_class = await AccountClass.findOne({
				where: {
					field: account.field,
					adding: account.adding
				}
			});
			let account_rec = await Account.create({
				name: account.name,
				key: account.key,
				accountClassId: account_class.id,
				accountCode: account.account_code,
				taxClass: account.tax_class,
				subAccountCount: account.sub_account_count,
				createdAt: now,
				updatedAt: now
			});
			account.rec_id = account_rec.id;
		}
		for ( let i = 0; i < values.accounts.length; i ++ ) {
			let account = values.accounts[i];
			await AccountRemaining.create({
				accountId: account.rec_id,
				term: account.term,
				debit: 0,
				credit: account.balance,
				balance: account.balance
			});
		}
		fs.writeFileSync("./accounts.json", JSON.stringify(values,null, 2));

		if	( values.sub_accounts )	{
			for ( let i = 0; i < values.sub_accounts.length; i ++ ) {
				let sub_account = values.sub_accounts[i];
				let account = await Account.findOne({
					where: {
						accountCode: sub_account.account_code,
					}
				});
				let sub_account_rec = await SubAccount.create({
					name: sub_account.name,
					key: sub_account.key,
					accountId: account.id,
					subAccountCode: sub_account.sub_account_code,
					taxClass: sub_account.tax_class
				});
				await SubAccountRemaining.create({
					subAccountId: sub_account_rec.id,
					term: sub_account.term,
					debit: 0,
					credit: sub_account.balance,
					balance: sub_account.balance
				});
			}
		}
	},
	
	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('AccountClasses', null, {});
	}
};
