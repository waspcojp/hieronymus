import models from '../models/index.js';

export const append_accounts = async (account) => {
	let code_len = account.code.length;
	let field = parseInt(account.code.substring(code_len - 8, code_len - 6));
	let adding = parseInt(account.code.substring(code_len - 5, code_len - 4));

	//console.log(field, adding);
	let account_class = await models.AccountClass.findOne({
		where: {
			field: field,
			adding: adding
		}
	});
	//console.log(account_class);
	let account_rec = await models.Account.create({
		name: account.name,
		key: account.key,
		accountClassId: account_class.id,
		accountCode: account.code,
		taxClass: account.tax_class,
		subAccountCount: 0
	});
}

append_accounts({
	code: '8020002',
	name: 'TEST',
	key: 'ukeri',
	tax_class: 1,
	term: 14,
	balance: 0
});

