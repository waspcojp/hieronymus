import models from '../models/index.js';
const Op = models.Sequelize.Op;
import {dc, numeric} from '../libs/parse_account_code.js';

const	getDetails = async (fy, account, sub_account) => {
  //console.log({account});
  //console.log({sub_account});
  let changes = [];
  let startDate;
  let endDate;
  if	( fy )	{
    startDate = new Date(fy.startDate);
    endDate = new Date(fy.endDate);
  } else {
    let d = await models.FiscalYear.findOne({
      order: [
        ['term', 'ASC']
      ]
    });
    startDate = new Date(d.startDate);
    d = await models.FiscalYear.findOne({
      order: [
        ['term', 'DESC']
      ]
    });
    endDate = new Date(d.endDate);
  }
  for ( let mon = startDate; mon < endDate; ) {
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
          '$crossSlip.year$': mon.getFullYear(),
          '$crossSlip.month$': mon.getMonth() + 1
        }
      };
    } else {
      where = {
        [Op.and]: {
          '$crossSlip.year$': mon.getFullYear(),
          '$crossSlip.month$': mon.getMonth() + 1,
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
        }
      ],
      order: [
        models.sequelize.literal('"crossSlip"."year", "crossSlip"."month", "crossSlip"."day", "crossSlip"."no", "CrossSlipDetail"."lineNo" ASC')
      ]
    });
    let change = {
      year: mon.getFullYear(),
      month: mon.getMonth() + 1,
      debitAmount: 0,
      debitTax: 0,
      creditAmount: 0,
      creditTax: 0
    }
    for ( let i = 0; i < details.length; i ++ ) {
      //console.log(i, details[i].debitSubAccount, details[i].creditSubAccount)
      if	(( sub_account ) &&
           ( sub_account > 0 )) {
        if	(( details[i].debitAccount === account ) &&
             ( details[i].debitSubAccount === parseInt(sub_account) ))	{
          change.debitAmount += numeric(details[i].debitAmount);
          change.debitTax += numeric(details[i].debitTax);
        }
        if	(( details[i].creditAccount === account ) &&
             ( details[i].creditSubAccount === parseInt(sub_account) ))	{
          change.creditAmount += numeric(details[i].creditAmount);
          change.creditTax += numeric(details[i].creditTax);
        }
      } else {
        if	( details[i].debitAccount === account )	{
          change.debitAmount += numeric(details[i].debitAmount);
          change.debitTax += numeric(details[i].debitTax);
        }
        if	( details[i].creditAccount === account )	{
          change.creditAmount += numeric(details[i].creditAmount);
          change.creditTax += numeric(details[i].creditTax);
        }
      }
    }
    changes.push(change);
    mon.setMonth(mon.getMonth() + 1);
  }
  return	(changes)
}

export default {
  get: (req, res, next) => {
    let term =  parseInt(req.params.term);
    let account = req.params.account;
    let sub_account = req.params.sub_account;
    
    //console.log('/api/changes/', term, account, sub_account);
    //console.log(term);
    if	( term > 0 )	{
      models.FiscalYear.findOne({
        where: {
          term: term
        }
      }).then((fy) => {
        getDetails(fy, account, sub_account).then((changes)=> {
          res.json(changes);
        })
      });
    } else {
      getDetails(undefined, account, sub_account).then((changes)=> {
        res.json(changes);
      })
    }
  },
};
