const models = require('../models');
const Op = models.Sequelize.Op;
const {is_authenticated} = require('../libs/user');
const company = require('../config/company');

module.exports = {
	get: async (req, res, next) => {
		let id =  req.params.id;
		console.log('/api/invoicer/', id);
		let include = [
				{
					model: models.Customer,
					as: 'Customer'
				}
			];

		
		if	( !id )	{
			let	order;
			let where;
			console.log('query', req.query);
            if  ( !req.query )  {
                res.json({
                    no: company.invoiceNo,
                    issueDate: new Date(),
                })
            } else
			if	( req.query.order )	{
				order = req.params.order;
			} else {
				order = [
					[ "issueDate", "ASC" ]
				]
			}
			if	( req.query.date )	{
				let date = new Date(req.query.date);
				where = {
					[Op.or]: [
						{
							issueDate: {
								[Op.eq]: date
							}
						},
						{
							paymentDate: {
								[Op.eq]: date
							}
						}
					]
				};
			} else {
				fy = await models.FiscalYear.findOne({
					where: {
						term: req.session.term
					}
				});
				where = {
						[Op.and]: [
							{
								issueDate: {
									[Op.gte]: new Date(fy.startDate)
								}
							},
							{
								issueDate: {
									[Op.lte]: new Date(fy.endDate)
								}
							}
						]
					};
			}
			if	( req.query.type )	{
				where = {
					[Op.and]: [
						where,
						{
							type: parseInt(req.query.type)
						}
					]
				};
			}
			if	( req.query.customer )	{
				where = {
					[Op.and]: [
						where,
						{
							customerId: parseInt(req.query.customer)
						}
					]
				};
			}
			if	( req.query.upper )	{
				if	( req.query.lower )	{
					where = {
						[Op.and]: [
							where,
							{
								amount: {
									[Op.gte]: parseInt(req.query.lower)
								}
							},
							{
								amount: {
									[Op.lte]: parseInt(req.query.upper)
								}
							}
						]
					};
				} else {
					where = {
						[Op.and]: [
							where,
							{
								amount: {
									[Op.lte]: parseInt(req.query.upper)
								}
							}
						]
					};
				}
			} else
			if	( req.query.lower )	{
				where = {
					[Op.and]: [
						where,
						{
							amount: {
								[Op.gte]: parseInt(req.query.lower)
							}
						}
					]
				};

			}
			models.Invoice.findAll({
				where: where,
				order: order,
				include: include,
				distinct: true
			}).then( async(vouchers) => {
				res.json(vouchers);
			});
		} else {
			models.Invoice.findOne({
				where: {
					id: id
				},
				include: include
			}).then((invoice) => {
				res.json(invoice);
			});
		}
	},
    post: (req, res, next) => {
        if  ( req.session.user.customer_management )    {
            models.Invoice.findByPk(id).then((invoice) => {
                invoice.save().then(()=> {
                    res.json({ code: 0 });
                }).catch (() => {
                    res.json({ code: -1 });
                });
            })
        } else {
            res.json({ code: -2 });
        }
    },
    update: (req, res, next) => {
        let id = parseInt(req.params.id);
        if  ( req.session.user.customer_management )    {
            models.Invoice.findByPk(id).then((invoice) => {
                invoice.save().then(()=> {
                    res.json({ code: 0 });
                }).catch (() => {
                    res.json({ code: -1 });
                });
            })
        } else {
            res.json({ code: -2 });
        }
    },
    delete: (req, res, next) => {
        let id = parseInt(req.params.id);
        if  ( req.session.user.customer_management )   {
            models.Invoice.findByPk(id).then((invoice) => {
                invoice.destroy().then(() => {
                    res.json({ code: 0});
                }).catch (()=> {
                    res.json({ code: -1});
                })
            })
        } else {
            res.json({ code: -2});
        }
    },
}