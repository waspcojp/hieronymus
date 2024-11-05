import models from '../models/index.js';

const term = 17;


const run = async () => {
	let dump = {};

	let fy = await models.FiscalYear.findOne({
		where: {
			term: term
		}
	});
	dump.FiscalYear = {
		startDate: fy.startDate,
		endDate: fy.endDate,
		term: fy.term
	}
	let mls = await	models.MonthlyLog.findAll({
		where: {
			term: term
		}
	});

	dump.MonthlyLog = [];
	mls.forEach((ml) => {
		dump.MonthlyLog.push({
			term: ml.term,
			month: ml.month,
			slipCount: ml.slipCount
		});
	});

	let account_classes = await models.AccountClass.findAll();
	dump.AccountClass = [];
	account_classes.forEach((acc) => {
		dump.AccountClass.push({
			major: acc.major,
			middle: acc.middle,
			minor: acc.minor,
			field: acc.field,
			adding: acc.adding
		});
	});

	let accounts = await models.Account.findAll();
	dump.Account = [];
	await Promise.all(
		accounts.map( async (acc) => {
			let account_class = await models.AccountClass.findByPk(acc.accountClassId);
			let subAccounts = [];
			if ( acc.subAccountCount > 0 ) {
				let subs = await models.SubAccount.findAll({
					where: {
						accountId: acc.id
					}
				});
				await Promise.all(
					subs.map( async (sub) => {
						let subr = await models.SubAccountRemaining.findOne({
							where: {
								subAccountId: sub.id,
								term: term
							}
						});
						if	( subr )	{
							subAccounts.push({
								name: sub.name,
								key: sub.key,
								subAccountCode: sub.subAccountCode,
								taxClass: sub.taxClass,
								debit: subr.debit,
								credit: subr.credit,
								balance: subr.balance
							});
						}
					})
				);
			}
			let account_remain = await models.AccountRemaining.findOne({
				where: {
					accountId: acc.id,
					term: term
				}
			});
			if	( account_remain )	{
				dump.Account.push({
					name: acc.name,
					key: acc.key,
					accountClass: {
						field: account_class.field,
						adding: account_class.adding
					},
					accountCode: acc.accountCode,
					taxClass: acc.taxClass,
					subAccountCount: acc.subAccountCount,
					debit: account_remain.debit,
					credit: account_remain.credit,
					balance: account_remain.balance,
					expiredAt: acc.expiredAt,
					SubAccounts: subAccounts
				});
			}
		})
	);

	return dump;
};

run().then((dump) => {
	console.log(JSON.stringify(dump, null, 2));
	return;
});

