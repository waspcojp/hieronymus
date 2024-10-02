import models from '../models/index.js';
const Op = models.Sequelize.Op;

const	get_details = async (fy, account, sub_account) => {
	console.log({account});
	console.log({sub_account});
	let ledger = [];
	for ( let mon = new Date(fy.startDate); mon < new Date(fy.endDate); ) {
		let where;

		if (( sub_account ) &&
			( sub_account > 0 )) {
			where = {
				[Op.and]: {
					[Op.or]: [
						{
							debitAccount: account,
							debitSubAccount: sub_account
						},
						{
							creditAccount: account,
							creditSubAccount: sub_account
						}
					],
					'$CrossSlip.year$': mon.getFullYear(),
					'$CrossSlip.month$': mon.getMonth() + 1
				}
			};
		} else {
			where = {
					[Op.and]: {
						'$CrossSlip.year$': mon.getFullYear(),
						'$CrossSlip.month$': mon.getMonth() + 1,
						[Op.or]: {
							debitAccount: account,
							creditAccount: account
						}
					}
				};
		}
		//console.log('where', where);

		let details = await models.CrossSlipDetail.findAll({
			where: where,
			include: [
				{
					model: models.CrossSlip,
					as: 'crossSlip',
				},
				{
					model: models.Voucher,
					required: false,
					as: 'debitVoucher',
					include: [{
						model: models.VoucherFile,
						as: 'files'
					}]
				},
				{
					model: models.Voucher,
					required: false,
					as: 'creditVoucher',
					include: [{
						model: models.VoucherFile,
						as: 'files'
					}]
				}
			],
			order: [
				models.sequelize.literal('"crossSlip"."year", "crossSlip"."month", "crossSlip"."day", "crossSlip"."no", "crossSlipDetail"."lineNo" ASC')
			]
		});
		for ( let i = 0; i < details.length; i ++ ) {
			ledger.push(details[i]);
		}
		mon.setMonth(mon.getMonth() + 1);
	}
	return	(ledger)
}

export default {
	get: (req, res, next) => {
		let term =  parseInt(req.params.term);
		let account = req.params.account;
		let sub_account = parseInt(req.params.sub_account);
		
		//console.log('/api/ledger/', term, account, sub_account);

		//console.log(term);
		models.FiscalYear.findOne({
			where: {
				term: term
			}
		}).then((fy) => {
			get_details(fy, account, sub_account).then((ledger)=> {
				res.json(ledger);
			})
		});
	},
};
