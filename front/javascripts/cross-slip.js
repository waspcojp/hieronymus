export const element_index = (element) => {
  return parseInt(element.id.match(/.*\[(\d+)\]/)[1]);
}
export const element_dc = (element) => {
  return element.id.split('-')[0];
}

let accounts;

export const numeric = (s) => {
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

export const find_account = (code) => {
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
export const find_sub_account = (account, code) => {
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

export const find_sub_account_by_code = (account_code, code) => {
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

export const find_tax_class = (ac, sub) => {
  let tax = 0;
  //console.log(ac, sub);
  for ( let i = 0; i < accounts.length; i ++ ) {
    let account = accounts[i];
    if ( account.code == ac ) {
      if ( account.subAccounts ) {
        for ( let j = 0 ; j < account.subAccounts.length; j ++ ) {
          let sub_account = account.subAccounts[j];
          if ( sub_account.code == sub ) {
            tax = sub_account.taxClass;
            break;
          }
        }
      } else {
        tax = account.taxClass;
      }
      break;
    }
  }
  return tax;
}


export const set_accounts = (arg) => {
  accounts = arg;
}

export const formatDate = (_date) => {
  let date;
  if ( _date )	{
    date = new Date(_date);
    return	`${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
  } else {
    return	('');
  }
}

export const voucherType = (code) => {
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

export const invoiceStatus = (code) => {
  if  ( code )  {
    switch  (code)  {
      case  11:
        return  ('見積');
        break;
      case  21:
        return  ('受注');
        break;
      case  31:
        return  ('請求');
        break;
      case  32:
        return  ('回収');
        break;
      default:
        return  ('その他');
        break;
    }
  }else{
    return  ('未設定');
  }
}

export const salesTax = (tax_class, _amount) => {
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
  //console.log('tax', tax);
  return	(tax)
}

export const TAX_CLASS = [
  [ '未選択', -1],
  [ '非課税', 0],
  [ '内税',   1],
  [ '外税',   2],
  [ '別計算', 9]
];

export const tax_class = (taxClass) => {
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
}
export default {
  set_accounts: set_accounts,
  find_account: find_account,
  find_sub_account: find_sub_account,
  find_sub_account_by_code: find_sub_account_by_code,
  find_tax_class: find_tax_class,
  element_index: element_index,
  element_dc: element_dc,
  numeric: numeric,
  formatDate: formatDate,
  voucherType: voucherType,
  invoiceStatus: invoiceStatus,
  sales_tax: salesTax,
  tax_class: tax_class,
  TAX_CLASS: TAX_CLASS
}

