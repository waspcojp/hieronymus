import models from '../models/index.js';
import CrossSlipDetails from '../libs/crossslipdetails.js';
import Accounts from '../libs/accounts.js';
import {field, dc, numeric} from '../libs/parse_account_code.js';
import {ledger_lines} from '../libs/ledger.js';
import TrialBalance from '../libs/trial_balance.js';

const   fiscalYear = async (term) => {
    let fy = await models.FiscalYear.findOne({
        where: {
            term: term
        }
    });
    let nfy = await models.FiscalYear.findOne({
        where: {
            term: fy.term + 1
        }
    });
    if  ( !nfy )    {
        nfy = await models.FiscalYear.create({
                startDate: new Date(fy.startDate.getFullYear() + 1,
                                    fy.startDate.getMonth(),
                                    fy.startDate.getDate()),
                endDate: new Date(fy.endDate.getFullYear() + 1,
                                  fy.endDate.getMonth(),
                                  fy.endDate.getDate()),
                term: fy.term + 1,
                year: fy.year + 1
            });
    }
    return  ([fy, nfy]);
}

const   Closing = async (arg, carry) => {
    let fy = arg[0];
    let nfy = arg[1];
    //console.log(fy);
    let accounts = await Accounts.all3(fy.term);
    for ( let i = 0; i < accounts.length; i ++ )    {
        let acc = accounts[i];
        if  ( acc.subAccounts ) {
            let subs = acc.subAccounts;
            for ( let j = 0; j < subs.length; j ++ )    {
                let sub = subs[j];
                let rem = await models.SubAccountRemaining.findOne({
                                where: {
                                    subAccountId: sub.id,
                                    term: nfy.term
                                }
                            });
                if ( !rem ) {
                    rem = await models.SubAccountRemaining.create({
                            subAccountId: sub.id,
                            term: nfy.term,
                            debit: 0,
                            credit: 0,
                            balance: 0
                        });
                } else {
                    rem.debit = 0;
                    rem.credit = 0;
                    rem.balance = 0;
                }
                //console.log(acc.code);
                if  ( field(acc.code) < 6 ) {
                    let pickup = {
                        debit: numeric(sub.debit),
                        credit: numeric(sub.credit),
                        balance: numeric(sub.balance)
                    };
                    details = await CrossSlipDetails.all(fy, acc.code, sub.code);
                    let lines = ledger_lines(acc.code, sub.code, pickup, details);
                    rem.debit = lines.sums.debitAmount;
                    rem.credit = lines.sums.creditAmount;
                    rem.balance = lines.sums.balance;
                    rem.save();
                } else {
                    rem.save();
                }
            }
        }
        if  ( acc.id ) {
            //console.log(acc);
            let rem = await models.AccountRemaining.findOne({
                    where: {
                        accountId: acc.id,
                        term: nfy.term
                    }
                });
            if ( !rem ) {
                rem = await models.AccountRemaining.create({
                            accountId: acc.id,
                            term: nfy.term,
                            debit: 0,
                            credit: 0,
                            balance: 0
                });
            } else {
                rem.debit = 0;
                rem.credit = 0;
                rem.balance = 0;
            }
            if  ( acc.code == '5040000')    {
                rem.debit = 0;
                rem.credit = carry.balance;
                rem.balance = carry.balance;
                rem.save();
            } else
            if  ( field(acc.code) < 6 ) {
                let pickup = {
                    debit: numeric(acc.debit),
                    credit: numeric(acc.credit),
                    balance: numeric(acc.balance)
                };
                details = await CrossSlipDetails.all(fy, acc.code);
                let lines = ledger_lines(acc.code, null, pickup, details);
                rem.debit = lines.sums.debitAmount;
                rem.credit = lines.sums.creditAmount ;
                rem.balance = lines.sums.balance;
                rem.save();
            } else {
                rem.save();
            }
        }
    }
}
const	aggregate = (lines, code) => {
	let sums = {
		pickup: 0,
		debit: 0,
		credit: 0,
		balance: 0
	}
	for ( line of lines )  {
		if      ( ( ( line.debit != 0 ) ||
					( line.credit != 0 ) ||
					( line.balance != 0 ) ) &&
				  ( line.code.match(code) ) )    {
			sums.pickup += line.pickup;
			sums.debit += line.debit;
			sums.credit += line.credit;
			sums.balance += line.balance;
		}
	}
	return  (sums);

}
const	account_line = (lines, code) => {
	let line;
	for ( let i = 0; i < lines.length; i ++ )  {
		if  ( lines[i].code == code)   {
			line = lines[i];
			break;
		}
	}
	return  (line);
}
const	net_income = (lines) => {
	let sum = [];
	sum[0] = aggregate(lines, /^6/);		//	[ "経常損益", "売上高" ]
	sum[1] = aggregate(lines, /^8/);		//	[ "経常損益", "営業外収益" ]
	sum[2] = aggregate(lines, /^901/);		//	[ "経常損益",	"営業外費用", "特別利益" ]

	sum[3] = aggregate(lines, /^7/);		//	[ "経常損益", "売上原価"]
	sum[4] = aggregate(lines, /^900/);		//	[ "経常損益", "営業外費用", "支払利息"]
	sum[5] = aggregate(lines, /^902/);		//	[ "経常損益", "営業外費用", "特別損失"]
	sum[6] = account_line(lines, '9030000');        //  法人税住民税等

	let line = account_line(lines, '5040000');      //  繰越利益剰余金
	line.credit = ( sum[0].balance + sum[1].balance + sum[2].balance ) -
				  ( sum[3].balance + sum[4].balance + sum[5].balance + sum[6].balance );
	line.balance = line.pickup - line.debit + line.credit;
	//console.log(line);
    return  (line);
}

/*
fiscalYear(14).then((ret) => {
    Closing(ret).then(() => {
        exit(0);
    });
});
*/

export default async (term) => {
    let fy = await fiscalYear(term);
    let {lines} = await TrialBalance(term);
    let carry = net_income(lines);
    await Closing(fy, carry);
}