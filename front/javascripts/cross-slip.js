const element_index = (element) => {
	return parseInt(element.id.match(/.*\[(\d+)\]/)[1]);
}
const element_dc = (element) => {
	return element.id.split('-')[0];
}

let accounts;

const numeric = (s) => {
	let ret;
	let sign;

	if ( s ) {
		if ( typeof s == 'number' ) {
			ret = s;
		} else {
			if ( s.length > 0 ) {
				if ( s[0] == '-' ) {
					sign = -1;
				} else {
					sign = 1;
				}
				let ss = s.replace(/[\D,\s]/g,'');
				if ( ss.length > 0 ) {
					ret = parseInt(ss) * sign;
				} else {
					ret = 0;
				}
			} else {
			ret = 0;
			}
		}
	} else {
		ret = 0;
	}
	return ret;
}

const find_account = (code) => {
	//console.log(`account [${code}]`);
	let account = { name: '', key: ''};
	if ( accounts ) {
		for ( let i = 0; i < accounts.length; i ++ ) {
			if ( accounts[i].code == code ) {
				account = accounts[i];
				break;
			}
		}
	}
	return account;
}
const find_sub_account = (account, code) => {
	let sub_account = { name: '', key: ''};
	
	if	( ( account ) &&
		  ( account.subAccounts ) ) {
		for ( let i = 0; i < account.subAccounts.length; i ++ ) {
			if ( account.subAccounts[i].code == code ) {
				sub_account = account.subAccounts[i];
				break;
			}
		}
	}
	return sub_account;
}

const find_sub_account_by_code = (account_code, code) => {
	let sub_account = { name: '', key: ''};

	let account = find_account(account_code);

	if ( account.subAccounts ) {
		for ( let i = 0; i < account.subAccounts.length; i ++ ) {
			if ( account.subAccounts[i].code == code ) {
				sub_account = account.subAccounts[i];
				break;
			}
		}
	}
	return sub_account;
}

const set_accounts = (arg) => {
	accounts = arg;
}

const formatDate = (_date) => {
	let date;
	if ( _date )	{
		date = new Date(_date);
		return	`${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
	} else {
		return	('');
	}
}

const voucherType = (code) => {
	if	( code )	{
		switch	(code)	{
		  case	1:
			return	('受取請求書');
			break;
		  case	2:
			return	('受取領収書');
			break;
		  case	11:
			return	('差出請求書');
			break;
		  case	12:
			return	('差出領収書');
			break;
		  default:
			return	('その他');
			break;
		}
	} else {
		return	('未設定');
	}
}

const salesTax = (tax_class, _amount) => {
	let amount = numeric(_amount);
	let tax;
	switch ( parseInt(tax_class) ) {
	  case 1:
		tax = Math.round(amount - amount / 110 * 100);
		break;
	  case 2:
		tax = Math.round(amount * 0.1);
		break;
	  default:
		tax = '';
		break;
	}
	console.log('tax', tax);
	return	(tax)
}

module.exports = {
	set_accounts: set_accounts,
	find_account: find_account,
	find_sub_account: find_sub_account,
	find_sub_account_by_code: find_sub_account_by_code,
	element_index: element_index,
	element_dc: element_dc,
	numeric: numeric,
	formatDate: formatDate,
	voucherType: voucherType,
	sales_tax: salesTax,
	tax_class: (taxClass) => {
		switch(taxClass) {
			case 0:
				return ("");
			case 1:
				return ('内税');
			case 2:
				return ('外税');
			case 9:
				return ('別計算');
		}
		return ('');
	},
	TAX_CLASS: [
		[ '非課税', 0],
		[ '内税',   1],
		[ '外税',   2],
		[ '別計算', 9]
	]
};
