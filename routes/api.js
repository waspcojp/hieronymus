const express = require('express');
const router = express.Router();
const journal = require('./api_journal');
const ledger = require('./api_ledger');
const account = require('./api_account');
const sub_account = require('./api_sub_account');
const remaining = require('./api_remaining');
const trial_balance = require('./api_trial_balance');
const customer = require('./api_customer');
const voucher = require('./api_voucher');
const user = require('./api_user');

//const account_classes = require('./api_account_classes');
const cross_slip = require('./api_cross_slip');
const cross_slip_detail = require('./api_cross_slip_detail');

const models = require('../models');
const Op = models.Sequelize.Op;

router.get('/user', user.get);
router.get('/user/:id', user.get);
router.get('/users', user.list);


router.get('/journal/:year/:month', journal.get);

router.get('/ledger/:term/:account', ledger.get);
router.get('/ledger/:term/:account/:sub_account', ledger.get);

router.get('/remaining/:term/:account', remaining.get);
router.get('/remaining/:term/:account/:sub_account', remaining.get);

router.get('/accounts', account.all);
router.get('/accounts/:term', account.all2);
router.get('/account/:code', account.get);
router.get('/account-class/:id', account.get_class);
router.put('/account/:term', account.update);
router.post('/account/:term', account.post);

router.put('/sub_account/:term', sub_account.update);
router.post('/sub_account/:term', sub_account.post);

router.get('/cross_slip/:year/:month/:no', cross_slip.get);
router.post('/cross_slip', cross_slip.post);
router.put('/cross_slip', cross_slip.update);
router.delete('/cross_slip', cross_slip.delete);

router.get('/cross-slip-detail/:id', cross_slip_detail.get);
router.put('/cross-slip-detail', cross_slip_detail.update);

router.get('/trial-balance/:term', trial_balance.get);

router.get('/customer', customer.get);
router.get('/customer/:id', customer.get);
router.post('/customer', customer.post);
router.put('/customer', customer.update);
router.put('/customer/:id', customer.update);
router.delete('/customer', customer.delete);
router.delete('/customer/:id', customer.delete);

router.get('/voucher', voucher.get);
router.get('/voucher/:id', voucher.get);
router.post('/voucher', voucher.post);
router.post('/voucher/upload/:id',voucher.upload);
router.post('/voucher/upload',voucher.upload);
router.put('/voucher', voucher.update);
router.put('/voucher/bind', voucher.bind);
router.put('/voucher/:id', voucher.update);
router.delete('/voucher', voucher.delete);
router.delete('/voucher/file', voucher.deleteFile);
router.delete('/voucher/:id', voucher.delete);
router.get('/voucher/files/:id', voucher.files);

router.get('/term/:year/:month', async (req, res, next) => {
	let year = req.params.year;
	let month = req.params.month;

	fy = await models.FiscalYear.findOne({
		where: {
			[Op.and]: {
				startDate: {
					[Op.lte]: new Date(year, month - 1, 1)
				},
				endDate: {
					[Op.gte]: new Date(year, month - 1, 1)
				}
			}
		}
	});
	res.json(fy);
});

router.get('/term/:term', async (req, res, next) => {
	let term = req.params.term;
	//console.log(term);
	fy = await models.FiscalYear.findOne({
		where: {
			term: term
		}
	});
	res.json(fy);
});
router.get('/term', async (req, res, next) => {
	models.FiscalYear.findAll().then((lines) => {
		res.json(lines);
	});
});

module.exports = router;
