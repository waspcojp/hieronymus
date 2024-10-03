import models from '../models/index.js';
const Op = models.Sequelize.Op;
import {make_klass} from  './parse_account_code.js';

export default class {
    static accounts;

    static async  all () {
		let accounts = await models.Account.findAll({
			order: [
				['accountCode']
			], 
		});
        let lines = [];
    	for ( let i = 0; i < accounts.length; i ++ ) {
	    	let acc = accounts[i];
		    if ( acc.subAccountCount > 0 ) {
    			let sub_lines = [];
	    		let subs = await models.SubAccount.findAll({
		    		where: {
			    		accountId: acc.id
				    },
    				order: [
	    				['subAccountCode']
		    		]
			    });
    		    for ( let j = 0; j < subs.length; j ++ ) {
				    let sub = subs[j];
					sub_lines.push({
					    key: sub.key,
					    name: sub.name,
			    	    code: sub.subAccountCode,
						taxClass: sub.taxClass
				    });
			    }
			    lines.push({
				    key: acc.key,
   					name: acc.name,
    				code: acc.accountCode,
	    			taxClass: acc.taxClass,
		    		subAccounts: sub_lines
			    });
		    } else {
			    lines.push({
				    key: acc.key,
    				name: acc.name,
	    			code: acc.accountCode,
		    		taxClass: acc.taxClass
			    });
		    }
	    }
        this.accounts = lines;
        return (lines);
    }
	static async all3(term)	{
		let accountClasses = await models.AccountClass.findAll({
			order: [
				['field', 'ASC'],
				['adding', 'ASC'],
			],
			include: [{
				model: models.Account,
				as: 'accounts',
				include: [{
						model: models.SubAccount,
						as: 'subAccounts',
						order: [
							['subAccountCode', 'ASC']
						]
					}
				],
				order: [
					['accountCode', 'ASC']
				]
			}]
		});
		let	lines = [];
		for	( let i = 0; i < accountClasses.length ; i ++ )	{
			let acl = accountClasses[i];
			if	( acl.accounts.length === 0 )	{
				lines.push({
					major_name: acl.major,
					middle_name: acl.middle,
					minor_name: acl.minor,
					acl_id: acl.id,
					acl_code: make_klass(acl.field, acl.adding)
				});
			} else
			for	( let j = 0; j < acl.accounts.length; j ++ )	{
				let acc = acl.accounts[j];
				if ( acc.subAccounts.length > 0 ) {
					let sub_lines = [];
					for ( let j = 0; j < acc.subAccounts.length; j ++ ) {
						let suba = acc.subAccounts[j];
						let rem = await models.SubAccountRemaining.findOne({
							where: {
								[Op.and]: {
									term: term,
									subAccountId: suba.id
								}
							}
						})
						sub_lines.push({
							id: suba.id,
							key: suba.key,
							name: suba.name,
							code: suba.subAccountCode,
							taxClass: suba.taxClass,
							debit: rem ? rem.debit : 0,
							credit: rem ? rem.credit : 0,
							balance: rem ? rem.balance :0
						});
					}
					let rem = await models.AccountRemaining.findOne({
						where: {
							[Op.and]: {
								term: term,
								accountId: acc.id
							}
						}
					});
					lines.push({
						id: acc.id,
						major_name: acl.major,
						middle_name: acl.middle,
						minor_name: acl.minor,
						acl_id: acl.id,
						acl_code: make_klass(acl.field, acl.adding),
						key: acc.key,
						name: acc.name,
						code: acc.accountCode,
						taxClass: acc.taxClass,
						subAccounts: sub_lines,
						debit: rem ? rem.debit : 0,
						credit: rem ? rem.credit : 0,
						balance: rem ? rem.balance :0
					});
				} else {
					let rem = await models.AccountRemaining.findOne({
						where: {
							[Op.and]: {
								term: term,
								accountId: acc.id
							}
						}
					});
					//console.log('remaining', rem);
					lines.push({
						id: acc.id,
						major_name: acl.major,
						middle_name: acl.middle,
						minor_name: acl.minor,
						acl_id: acl.id,
						acl_code: make_klass(acl.field, acl.adding),
						key: acc.key,
						name: acc.name,
						code: acc.accountCode,
						taxClass: acc.taxClass,
						debit: rem ? rem.debit : 0,
						credit: rem ? rem.credit : 0,
						balance: rem ? rem.balance :0
					});
				}
			}
		}
		//console.log(lines);
        this.accounts = lines;
		return	(lines);
	}
    static async all2 (term) {
		let accounts = await models.Account.findAll({
			order: [
				['accountCode']
			],
			include: [{
				model: models.SubAccount,
				order: ['subAccountCode', 'ASC'],
				as: 'subAccounts'
			}, {
				model: models.AccountClass,
				as: 'accountClass'
			}]
		});
		//console.log(JSON.stringify(accounts,null,2));
		let lines = [];
		for ( let i = 0; i < accounts.length; i ++ ) {
			let acc = accounts[i];
			if ( acc.subAccounts.length > 0 ) {
				let sub_lines = [];
				for ( let j = 0; j < acc.subAccounts.length; j ++ ) {
					let suba = acc.subAccounts[j];
					let rem = await models.SubAccountRemaining.findOne({
						where: {
							[Op.and]: {
								term: term,
								subAccountId: suba.id
							}
						}
					})
					sub_lines.push({
						id: suba.id,
						key: suba.key,
						name: suba.name,
						code: suba.subAccountCode,
						taxClass: suba.taxClass,
						debit: rem ? rem.debit : 0,
						credit: rem ? rem.credit : 0,
						balance: rem ? rem.balance :0
					});
				}
				let rem = await models.AccountRemaining.findOne({
					where: {
						[Op.and]: {
							term: term,
							accountId: acc.id
						}
					}
				});
				lines.push({
					id: acc.id,
					major_name: acc.accountClass.major,
					middle_name: acc.accountClass.middle,
					minor_name: acc.accountClass.minor,
					key: acc.key,
					name: acc.name,
					code: acc.accountCode,
					taxClass: acc.taxClass,
					subAccounts: sub_lines,
					debit: rem ? rem.debit : 0,
					credit: rem ? rem.credit : 0,
					balance: rem ? rem.balance :0
				});
			} else {
				let rem = await models.AccountRemaining.findOne({
					where: {
						[Op.and]: {
							term: term,
							accountId: acc.id
						}
					}
				});
				//console.log('remaining', rem);
				lines.push({
					id: acc.id,
					major_name: acc.accountClass.major,
					middle_name: acc.accountClass.middle,
					minor_name: acc.accountClass.minor,
					key: acc.key,
					name: acc.name,
					code: acc.accountCode,
					taxClass: acc.taxClass,
					debit: rem ? rem.debit : 0,
					credit: rem ? rem.credit : 0,
					balance: rem ? rem.balance :0
				});
			}
		}
		//console.log(JSON.stringify(lines, null, 2))
        this.accounts = lines;
        return (lines);
    }
    static find_account(code) {
        let account;
		if ( code ) {
			account = { name: '', key: ''};
        	for ( let i = 0; i < this.accounts.length; i ++ ) {
            	if ( this.accounts[i].code == code ) {
                	account = this.accounts[i];
                	break;
            	}
        	}
		} else {
			account = { name: '諸口', key: ''};
		}
        return account;
    }
	static	find_account_by_name(name)	{
        let account;
		if ( name ) {
			account = { name: '', key: ''};
        	for ( let i = 0; i < this.accounts.length; i ++ ) {
            	if ( this.accounts[i].name == name ) {
                	account = this.accounts[i];
                	break;
            	}
        	}
		} else {
			account = { name: '諸口', key: ''};
		}
        return account;
	}
    static find_sub_account(code, sub_code) {
        let sub_account = { name: ''};

        let account = this.find_account(code);
    
        if ( account.subAccounts ) {
            for ( let i = 0; i < account.subAccounts.length; i ++ ) {
                if ( account.subAccounts[i].code == sub_code ) {
                    sub_account = account.subAccounts[i];
                    break;
                }
            }
        }
        return sub_account;
    }
    static name(code) {
        return this.find_account(code).name;
    }
    static sub_name(code, sub_code) {
        return this.find_sub_account(code, sub_code).name;
    }
	static TAX_CLASS = {
		non: 0,
		included: 1,
		excluded: 2,
		other: 9
	}
	static tax_class(taxClass) {
		switch(taxClass) {
			case 0:
				return ("非課税");
			case 1:
				return ('内税');
			case 2:
				return ('外税');
			case 9:
				return ('別計算');
		}
		return ('');
	}
}