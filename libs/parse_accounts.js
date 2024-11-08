const INPUT_FILE = './accounts.csv'

import child_process from 'child_process';

export const exec = (term) => {
  //let file = fs.readFileSync(INPUT_FILE, "utf-8");		// csv uft-8 encoded
  let file = child_process.execSync(`/usr/bin/iconv -f shift_jis -t utf-8 < ${INPUT_FILE}`, {	//	csv by Excel
    encoding: "utf-8"
  });
  let lines = file.split("\r\n");		// Excel csv line separator

  // skip title 2lines
  lines.shift();
  lines.shift();

  // var names line
  let names = lines[0].split(",");
  lines.shift();

  let accountClasses = [];
  let accounts = [];
  let subAccounts = [];
  let ent_1 = {};
  let class_code;
  let field;
  let adding;
  let seq = 0;
  let account_code;
  let sub_account;

  lines.forEach ( (line) => {
    let ent = {};
    let vars = line.split(",");

    if ( vars.length > 3 ) {
      for ( let i = 0; i < names.length; i ++ ) {
        ent[names[i]] = vars[i];
      }
      ent.subject_code_seq = parseInt(ent.subject_code_seq);
      ent.sub_subject_code = parseInt(ent.sub_subject_code);
      ent.tax_class = parseInt(ent.tax_class);

      if (( ent.subject_code_field != ent_1.subject_code_field ) ||
        ( ent.subject_code_sum != ent_1.subject_code_sum )) {
        seq = 0;
        class_code = `${ent.subject_code_field}${('00'+ent.subject_code_sum).slice(-2)}`
        field = parseInt(ent.subject_code_field);
        adding = parseInt(ent.subject_code_sum);
        accountClasses.push({
          major: ent.major_class,
          middle: ent.middle_class,
          minor: ent.minor_class,
          field: field,
          adding: adding
        });
      }
      if ( ent.sub_subject_code === 0 ) {
        account_code = `${class_code}${('0000'+seq).slice(-4)}`;
        sub_account = 0;
        accounts.push({
          name: ent.account,
          key: ent.major_key=='' ? null : ent.major_key,
          field: field,
          adding: adding,
          account_code: account_code,
          sub_account_count: 0,
          tax_class: ent.tax_class,
          balance: parseInt(ent.beginning_balance),
          term: term
        });
        seq += 10;
      } else {
        sub_account += 1;
        subAccounts.push({
          name: ent.sub_account,
          key: ent.minor_key,
          account_code: account_code,
          sub_account_code: sub_account,
          term: term,
          tax_class: ent.tax_class,
          balance: parseInt(ent.beginning_balance)
        });
      }
      ent_1 = ent;
    }
  });

  accounts.forEach( (account) => {
    let balance = 0;
    let count = 0;
    subAccounts.forEach((sub_account) => {
      if ( account.account_code == sub_account.account_code ) {
        count += 1;
        balance += sub_account.balance;
      }
    });
    if ( count > 0 ) {
      account.balance = balance;
      account.sub_account_count = count;
    }
  });
  //console.log(accountClasses);
  //console.log(accounts);
  //console.log(subAccounts);

  return {
    accountClasses: accountClasses,
    accounts: accounts,
    subAccounts: subAccounts
  };
}

export default exec;
