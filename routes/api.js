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
const invoice = require('./api_invoice');

//const account_classes = require('./api_account_classes');
const cross_slip = require('./api_cross_slip');
const cross_slip_detail = require('./api_cross_slip_detail');

const models = require('../models');
const Op = models.Sequelize.Op;
const pkg = require('../package.json');
const VERSION = pkg.version;

router.get('/user', user.get);
router.get('/user/:id', user.get);
router.put('/user/password', user.password);
router.post('/user/login', user.login);
router.post('/user/signup', user.signup);
router.put('/user/:id', user.update);
router.delete('/user/:id', user.delete);
router.get('/users', user.list);

router.get('/invoice', invoice.get);
router.get('/invoice/:id', invoice.get);
router.post('/invoice', invoice.post);
router.put('/invoice', invoice.update);
router.put('/invoice/:id', invoice.update);
router.delete('/invoice/:id', invoice.delete);

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
router.put('/cross_slip/approve', cross_slip.approve);
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
					[Op.lte]: new Date(year, month - 1, 2)
				},
				endDate: {
					[Op.gte]: new Date(year, month - 1, 1)
				}
			}
		}
	});
	console.log(fy);
	res.json(fy);
});

router.get('/term/:term', async (req, res, next) => {
	let term = parseInt(req.params.term);
	console.log({term});
	if	( term > 0 )	{
		fy = await models.FiscalYear.findOne({
			where: {
				term: term
			}
		});
		res.json(fy);
	}
});
router.put('/term/:id', async(req, res, next) => {
  let id = parseInt(req.params.id);
  console.log({id});
  fy = await models.FiscalYear.findByPk(id);
  fy.taxIncluded = req.body.taxIncluded;
  fy.save();
  res.json({
    code: 0
  })
})
router.get('/term', async (req, res, next) => {
	models.FiscalYear.findAll({
    order: [
      ['term', 'ASC']
    ]
  }).then((lines) => {
		res.json(lines);
	});
});
const parseAccounts = require('../libs/parse_accounts');
const createInitialAccount = async (term, t) => {
  const now = new Date();
  let account_classes = [];
  const values = parseAccounts.exec(term);
  values.account_classes.forEach((account_class) => {
    account_classes.push({
      major: account_class.major,
      middle: account_class.middle,
      minor: account_class.minor,
      field: account_class.field,
      adding: account_class.adding,
      createdAt: now,
      updatedAt: now
    });
  });
  await models.AccountClass.bulkCreate(account_classes,{ transaction: t });
  account_classes = await models.AccountClass.findAll({transaction: t });
  for ( let i = 0; i < values.accounts.length; i ++ ) {
    let account = values.accounts[i];
    let account_class = await models.AccountClass.findOne({
      where: {
        field: account.field,
        adding: account.adding
      },
      transaction: t 
    });
    let account_rec = await models.Account.create({
      name: account.name,
      key: account.key,
      accountClassId: account_class.id,
      accountCode: account.account_code,
      taxClass: account.tax_class,
      subAccountCount: account.sub_account_count,
      createdAt: now,
      updatedAt: now
    },{ transaction: t });
    account.rec_id = account_rec.id;
  }
  for ( let i = 0; i < values.accounts.length; i ++ ) {
    let account = values.accounts[i];
    await models.AccountRemaining.create({
      accountId: account.rec_id,
      term: account.term,
      debit: 0,
      credit: account.balance,
      balance: account.balance
    },{ transaction: t });
  }
  if	( values.sub_accounts )	{
    for ( let i = 0; i < values.sub_accounts.length; i ++ ) {
      let sub_account = values.sub_accounts[i];
      let account = await models.Account.findOne({
        where: {
          accountCode: sub_account.account_code,
        },
        transaction: t });
      let sub_account_rec = await models.SubAccount.create({
        name: sub_account.name,
        key: sub_account.key,
        accountId: account.id,
        subAccountCode: sub_account.sub_account_code,
        taxClass: sub_account.tax_class
      },{ transaction: t });
      await models.SubAccountRemaining.create({
        subAccountId: sub_account_rec.id,
        term: sub_account.term,
        debit: 0,
        credit: sub_account.balance,
        balance: sub_account.balance
      },{ transaction: t });
    }
  }
}
router.post('/setup', async (req, res, next) => {
	const countFy = await models.FiscalYear.count();
  if ( countFy === 0 ){
    const t = await models.sequelize.transaction();
    try {
      const fy =  await models.FiscalYear.create({
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        term: req.body.term,
        year: req.body.year
      },{ transaction: t });
      await createInitialAccount(req.body.term, t);
      await t.commit();
      req.session.term = req.body.term;
      req.session.save();
      res.json({code: 0});
    }catch(e){
      console.log(e.message)
      await t.rollback();
      res.json({code: -99});
    }
  }else{
    // exists FiscalYear
    res.json({code: -1});
  }
})
router.get('/version', async (req, res, next) => {
	res.json({version: VERSION});
});
module.exports = router;
