import models from '../models/index.js';
const Op = models.Sequelize.Op;
import Accounts from '../libs/accounts.js';

export default {
	get: async (req, res, next) => {
		let account_code = req.params.code;

		let account = await models.Account.findOne({
			where: {
				accountCode: account_code
			},
			include: [{
				model: models.SubAccount,
				order: ['subAccountId', 'ASC'],
				as: 'subAccounts'
			}],
		});
		//console.log(account);
		res.json(account);
	},
	get_class: (req, res, next) => {
		let id = req.params.id;
		models.AccountClass.findOne({
			where: {
				id: id
			}
		}).then((data) => {
			console.log({data});
			res.json(data);
		});
	},
	post: async(req, res, next) => {
		let term = parseInt(req.params.term);
		let new_account = await models.Account.create({
			name: req.body.name,
			key: req.body.key,
			accountClassId: req.body.klass_id,
			accountCode: req.body.code,
			taxClass: req.body.tax_class,
			subAccountCount: 0
		});
		await models.AccountRemaining.create({
			term: term,
			accountId: new_account.id,
			debit: req.body.debit,
			credit: req.body.credit,
			balance: req.body.balance
		});
		res.json({
			accountCode: new_account.accountCode
		})
	},
	update: async(req, res, next) => {
		let sub_code = req.body.sub_code;
		let term = parseInt(req.params.term);
		let account = await models.Account.findOne({
			where: {
				accountCode: req.body.code
			}
		});
		account.key = req.body.key;
		account.name = req.body.name;
		account.taxClass = req.body.tax_class;
		account.save();
		let rem = await models.AccountRemaining.findOne({
			where: {
				[Op.and]: {
					term: term,
					accountId: account.id
				}
			}
		});
		if ( !rem ) {
			rem = new models.AccountRemaining({
				term: term,
				accountId: account.id
			});
		}
		rem.debit = req.body.debit;
		rem.credit = req.body.credit;
		rem.balance = req.body.balance;
		rem.save();
		res.json({
			code: 0
		});
	},
	all: (req, res, next) => {
		Accounts.all().then((lines) => {
			res.json(lines);
		});
	},
	all2: async (req, res, next) => {
		Accounts.all3(req.params.term).then((lines) => {
			res.json(lines);
		});
	},
}
