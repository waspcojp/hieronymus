const models = require('../models');

const append_sub_accounts = async (account) => {

	let code_len = account.code.length;
	let field = account.code.substring(code_len - 8, code_len - 6);
	let adding = account.code.substring(code_len - 5, code_len - 4);

	let account_class = await models.AccountClass.findOne({
		where: {
			field: field,
			adding: adding
		}
	});
	console.log(account_class);
	let account_rec;

	account_rec = await models.Account.findOne({
		where: {
			accountCode: account.code
		}
	});
	console.log(account_rec);

	account_rec.subAccountCount += 1;
	account_rec.save();

	let sub_account_rec = await models.SubAccount.create({
		name: account.name,
		key: account.key,
		accountId: account_rec.id,
		subAccountCode: account_rec.subAccountCount,
		taxClass: account.tax_class
	});

	await models.SubAccountRemaining.create({
		subAccountId: sub_account_rec.id,
		term: account.term,
		debit: 0,
		credit: account.balance,
		balance: account.balance
	});
}

append_sub_accounts({
	code: '7010000',
	name: 'プラックス',
	key: 'pulax',
	tax_class: 1,
	term: 14,
	balance: 0
});

