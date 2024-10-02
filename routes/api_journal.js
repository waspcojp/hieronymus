import models from '../models/index.js';
const Op = models.Sequelize.Op;

export default {
	get: async (req, res, next) => {
		let year =  parseInt(req.params.year);
		let month =  parseInt(req.params.month);
		//console.log('/api/journal/', year, month);
		
		let cross_slips = [];

		let slips = await models.CrossSlip.findAll({
			where: {
				[Op.and]: {
					year: year,
					month: month
				}
			},
			include: [{
					model: models.User,
					as: 'creater'
				}, {
					model: models.User,
					as: 'approver'
				}
			],
			order: [
				[ 'year', 'ASC'],
				[ 'month', 'ASC'],
				[ 'day', 'ASC' ],
				[ 'no', 'ASC' ]
			]
		});
		//console.log('slips', slips);

		for ( let i = 0; i < slips.length; i ++ ) {
			let slip = slips[i];
			let details = await models.CrossSlipDetail.findAll({
				where: {
					crossSlipId: slip.id
				},
				include: [
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
					['lineNo', 'ASC' ]
				]
			});
			let lines = [];
			for ( let j = 0; j < details.length; j ++ ) {
				let detail = details[j];
				lines.push({
					id: detail.id,
					lineNo: detail.lineNo,
					debitAmount: detail.debitAmount,
					debitTax: detail.debitTax,

					debitAccount: detail.debitAccount,
					debitSubAccount: detail.debitSubAccount,
					debitVoucherId: detail.debitVoucherId,
					debitVoucher: detail.debitVoucher,

					application1: detail.application1,
					application2: detail.application2,

					creditAmount: detail.creditAmount,
					creditTax: detail.creditTax,
					creditVoucherId: detail.creditVoucherId,
					creditVoucher: detail.creditVoucher,

					creditAccount: detail.creditAccount,
					creditSubAccount: detail.creditSubAccount
				});
			}
			cross_slips.push({
				id: slip.id,
				year: slip.year,
				month: slip.month,
				day: slip.day,
				no: slip.no,
				term: slip.term,
				createrName: slip.creater ? slip.creater.name : '',
				approverName: slip.approver ? slip.approver.name : '',
				approvedAt: slip.approvedAt,
				lines: lines
			});
		}
		//console.log(JSON.stringify(cross_slips, ' ', 2));
		res.json(cross_slips);
	},
};
