import models from '../models/index.js';
const Op = models.Sequelize.Op;

export default {
	get: async (req, res, next) => {
		let id =  req.params.id;
		console.log('/api/customer/', id);
		
		if	( !id )	{
			models.Customer.findAll({
				order: [
					['name', 'ASC']
				]
			}).then((customers) => {
				res.json(customers);
			});
		} else {
			models.Cusomer.findOne({
				where: {
					id: id
				}
			}).then((customer) => {
				res.json(customer);
			});
		}
	},
	post: async(req, res, next) => {
		let body = req.body;
		//console.log('body:', body);

		let customer = await models.Customer.create(body)
		//console.log(customer);
		
		res.json({
			id: customer.id
		});
	},
	update: async(req, res, next) => {
		let body = req.body;
		let id = req.params.id ? req.params.id : body.id;

		let customer = await models.Customer.findOne({
			where: {
				id: id
			}
		});
		if	( customer )	{
			customer.set(body);
			customer.save().then(() => {
				res.json(customer);
			});
		}
	},
	delete: async(req, res, next) => {
		let body = req.body;
		let id = req.params.id ? req.params.id : body.id;

		let customer = await models.Customer.findOne({
			where: {
				id: id
			}
		});
		if	( customer )	{
			customer.destroy().then(() => {
				res.json({
					code: 0});
			});
		}
	},
};
