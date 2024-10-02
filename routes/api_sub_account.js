import models from '../models/index.js';
const Op = models.Sequelize.Op;
import Acc from '../libs/parse_account_code.js';

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
	post: async(req, res, next) => {
		let klass = Acc.klass(req.body.code);
		let account = await models.Account.findOne({
			where: {
				accountCode: req.body.code
			}
		});
		account.subAccountCount += 1;
		let code = account.subAccountCount;
		account.save();
		let new_sub_account = await models.SubAccount.create({
			name: req.body.sub_name,
			key: req.body.key,
			accountId: account.id,
			subAccountCode: code,
			taxClass: req.body.tax_class
		});
		await models.SubAccountRemaining.create({
			term: req.params.term,
			subAccountId: new_sub_account.id,
			debit: req.body.debit,
			credit: req.body.credit,
			balance: req.body.balance
		});
		res.json({
			accountCode: account.accountCode,
			subAccountCode: new_sub_account.subAccountCode
		})
	},
	update: async(req, res, next) => {
		console.log(req.body);
		let sub_code = req.body.sub_code;
		let term = parseInt(req.params.term);
		let account = await models.Account.findOne({
			where: {
				accountCode: req.body.code
			}
		});
		let sub = await models.SubAccount.findOne({
			where: {
				accountId: account.id,
				subAccountCode: sub_code
			}
		});
		console.log(sub);
		if ( sub ) {
			sub.key = req.body.key;
			sub.name = req.body.sub_name;
			sub.taxClass = req.body.tax_class;
			sub.save();
			let rem = await models.SubAccountRemaining.findOne({
				where: {
					[Op.and]: {
						term: term,
						subAccountId: sub.id
					}
				}
			});
			if ( !rem ) {
				rem = new models.SubAccountRemaining({
					term: term,
					subAccountId: sub.id
				});
			}
			rem.debit = req.body.debit;
			rem.credit = req.body.credit;
			rem.balance = req.body.balance;
			rem.save();
		}
		res.json({
			code: 0
		});
	},
}
