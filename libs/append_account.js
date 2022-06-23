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

	account_rec = await models.Account.create({
		name: account.name,
		key: account.key,
		accountClassId: account_class.id,
		accountCode: account.code,
		taxClass: account.tax_class,
		subAccountCount: 0
	});
}

append_sub_accounts({
	code: '8020000',
	name: '受取利息',
	key: 'ukeri',
	tax_class: 1,
	term: 14,
	balance: 0
});

