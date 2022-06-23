const models = require('../models');
const Op = models.Sequelize.Op;

module.exports = {
	get: async(req, res, next) => {
		let year = req.params.year;
		let month = req.params.month;
		let no = req.params.no;

		let cross_slip = await models.CrossSlip.findOne({
			where: {
				[Op.and]: {
					year: year,
					month: month,
					no: no
				}
			},
			include: [
				{
					model: models.CrossSlipDetail,
					as: 'lines'
				}
			]
		});
		//console.log(cross_slip);
		res.json(cross_slip);
	},
	post: async(req, res, next) => {
		let body = req.body;
		//console.log('body:', body);

		fy = await models.FiscalYear.findOne({
			where: {
				startDate: {
					[Op.lte]: new Date(body.year, body.month - 1, body.day)
				},
				endDate: {
					[Op.gte]: new Date(body.year, body.month - 1, body.day)
				}
			}
		});
		//console.log('fy', fy);
		ml = await models.MonthlyLog.findOne({
			where: {
				term: fy.term,
				month: body.month
			}
		});
		if	( !ml )	{
			ml = await models.MonthlyLog.create({
				term: fy.term,
				month: body.month,
				slipCount: 0,
				voucharCount: 0
			})
		}
		//console.log('ml', ml);
		ml.slipCount += 1;

		slip = await models.CrossSlip.create({
			year: body.year,
			month: body.month,
			day: body.day,
			no: ml.slipCount,
			lineCount: body.lines.length,
			term: body.term
		});
		//console.log(slip);
		ml.save();

		let lines = [];
		for ( let i = 0; i < body.lines.length ; i ++ ) {
			let line = body.lines[i];
			line.crossSlipId = slip.id;
			line.lineNo = i;
			//console.log(line);
			await models.CrossSlipDetail.create(line);
			lines.push(line);
		}
		
		res.json({
			year: body.year,
			month: body.month,
			day: body.day,
			no: slip.no,
			lines: lines
		});
	},
	update: async(req, res, next) => {
		let body = req.body;
		//console.log('update body:', body);
		let slip = await models.CrossSlip.findOne({
			where: {
				year: body.year,
				month: body.month,
				no: body.no
			}
		});
		if ( slip ) {
			//console.log(slip);

			slip.lineCount = body.lines.length;
			slip.day = body.day;
			slip.save();
		
			details = await models.CrossSlipDetail.findAll({
				where: {
					crossSlipId: slip.id
				}
			});
			for ( let i = 0; i < details.length; i ++ ) {
				//console.log('delete', details[i]);
				await details[i].destroy();
			}
			for ( let i = 0; i < body.lines.length ; i ++ ) {
				let line = body.lines[i];
				line.crossSlipId = slip.id;
				line.lineNo = i;
				//console.log(line);
				await models.CrossSlipDetail.create(line);
			}
			res.json({
				code: 0
			});
		} else {
			res.json({
				code: -1,
				message: 'record not found'
			});
		}

	},
	delete: async(req, res, next) => {
		let body = req.body;
		//console.log('body:', body);
		let slip = await models.CrossSlip.findOne({
			where: {
				year: body.year,
				month: body.month,
				day: body.day,
				no: body.no
			}
		});
		//console.log('delete', slip);
		details = await models.CrossSlipDetail.findAll({
			where: {
				crossSlipId: slip.id
			}
		});
		for ( let i = 0; i < details.length; i ++ ) {
			//console.log('delete', details[i]);
			await details[i].destroy();
		}
		await slip.destroy();
		res.json({
			code: 0,
		});
	},
}
