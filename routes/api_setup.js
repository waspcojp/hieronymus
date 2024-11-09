import models from '../models/index.js';
import parseAccounts from '../libs/parse_accounts.js';

const createInitialAccount = async (term, t) => {
  const now = new Date();
  let accountClasses = [];
  const values = parseAccounts(term);
  values.accountClasses.forEach((account_class) => {
    accountClasses.push({
      major: account_class.major,
      middle: account_class.middle,
      minor: account_class.minor,
      field: account_class.field,
      adding: account_class.adding,
      createdAt: now,
      updatedAt: now
    });
  });
  await models.AccountClass.bulkCreate(accountClasses,{ transaction: t });
  accountClasses = await models.AccountClass.findAll({transaction: t });
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
  if	( values.subAccounts )	{
    for ( let i = 0; i < values.subAccounts.length; i ++ ) {
      let sub_account = values.subAccounts[i];
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

export const setup = async (req, res, next) => {
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
      console.log(e)
      await t.rollback();
      res.json({code: -99});
    }
  }else{
    // exists FiscalYear
    res.json({code: -1});
  }
}

export default setup;
