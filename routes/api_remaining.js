import models from '../models/index.js';
const Op = models.Sequelize.Op;

export default {
	get: async (req, res, next) => {
		let term = parseInt(req.params.term);
		let account = req.params.account;
		let sub_account = req.params.sub_account;
		let remaining;

		if	( term === 0 )	{
			let d = await models.FiscalYear.findOne({
				order: [
					['term', 'ASC']
				]
			});
			term = d.term;
		}

		let account_rec = await models.Account.findOne({
			where: {
				accountCode: account
			}
		});
		if ( sub_account ) {
			let sub_account_rec = await models.SubAccount.findOne({
				where: {
					accountId: account_rec.id,
					subAccountCode: sub_account,
				}
			});
			remaining = await models.SubAccountRemaining.findOne({
				where: {
					[Op.and]: {
						term: term,
						subAccountId: sub_account_rec.id
					}
				}
			});
			
		} else {
			remaining = await models.AccountRemaining.findOne({
				where: {
					[Op.and]: {
						term: term,
						accountId: account_rec.id
					}
				}
			});
		}
		//console.log('remaining', remaining);
		res.json(remaining);
	},
}
