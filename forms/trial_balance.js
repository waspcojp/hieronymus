import TrialBalance from '../libs/trial_balance.js';
import {Book, Page} from './book.js';
import {field, numeric} from '../libs/parse_account_code.js';
import SumTable from './sum_table.js';


class TrialBalancePage  {
  constructor(book, term, lines, month)   {
    this.term = term;
    this.lines = lines;
    this.book = book;
    this.month = month;
  }
  make_header(title)   {
    this.page = new Page(this.book, title);
    let sheet = this.page.sheet;
    sheet.columns = [
      { header: '勘定科目', width: 32 },
      { header: '繰越金額', width: 14 },
      { header: '借方金額', width: 14 },
      { header: '貸方金額', width: 14, },
      { header: '残高', width: 14 },
    ];
    for ( let i = 1; i < 5; i ++ ) {
      sheet.getCell(1,i).style = {
        alignment: {
          vertical: 'middle',
          horizontal: 'center'
        },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' }
        }
      };
    }
    sheet.getCell(1,5).style = {
      alignment: {
        vertical: 'middle',
        horizontal: 'center'
      },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin'}
      }
    };
    this.sheet = sheet;
    this.lineNo = 2;
    this.line = {};
  }
  line_out(name, pickup, debit, credit, balance) {
    let sheet = this.page.sheet;
    sheet.getCell(this.lineNo, 1).value = name;
    sheet.getCell(this.lineNo, 2).value = pickup;
    sheet.getCell(this.lineNo, 3).value = debit;
    sheet.getCell(this.lineNo, 4).value = credit;
    sheet.getCell(this.lineNo, 5).value = balance;
    sheet.getCell(this.lineNo, 1).style = {
      alignment: {
        vertical: 'middle',
        horizontal: 'left'
      },
      border: {
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      }
    };
    for ( let i = 2; i < 5; i ++ ) {
      sheet.getCell(this.lineNo, i).style = {
        alignment: {
          vertical: 'middle',
          horizontal: 'right'
        },
        border: {
          bottom: { style: 'thin' },
          left: { style: 'thin' }
        },
        numFmt: '¥#,##0'
      };
    }
    sheet.getCell(this.lineNo, 5).style = {
      alignment: {
        vertical: 'middle',
        horizontal: 'right'
      },
      border: {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin'}
      },
      numFmt: '¥#,##0'
    };
    this.lineNo += 1;
    return  (this.lineNo - 1);
  }
  _account_line(name) {
    let line;
    for ( let i = 0; i < this.lines.length; i ++ )  {
      if  ( this.lines[i].name == name)   {
        line = this.lines[i];
        break;
      }
    }
    return  (line);
  }
  account_line(name)  {
    let line = this._account_line(name);
    if  ( line )    {
      this.line_out(`  ${line.name}`,line.pickup, line.debit, line.credit, line.balance);
    }
    return  (line);
  }
  print(suppress, out_classes) {
    let pickup = new SumTable(3);
    let debit = new SumTable(3);
    let credit = new SumTable(3);
    let balance = new SumTable(3)
    let classes = [];

    for ( let i = 0; i < this.lines.length ; i ++ ) {
      let line = this.lines[i];
      if  ( !line.code )  continue;
      if  (( out_classes.length == 1 ) &&
           ( out_classes[0] == '資産') &&
           ( line.code == '1140000' ))    continue;
      if  ((( !suppress ) ||
            ( line.pickup != 0 ) ||
            ( line.debit != 0 ) ||
            ( line.credit != 0 ) ||
            ( line.balance != 0 )) &&
           ( parseInt(field(line.code)) != 10 ) &&
           (( !out_classes[0] ) ||
            ( line.major_name == out_classes[0] )) &&
           (( !out_classes[1] ) ||
            ( line.middle_name == out_classes[1] )) &&
           (( !out_classes[2] ) ||
            ( line.minor_name == out_classes[2] )))   {
        if  (( classes[2] ) &&
             ( classes[2] != line.minor_name )) {
          this.line_out(`  ${classes[2]}計`, numeric(pickup.sum(2)),
          debit.sum(2), credit.sum(2), balance.sum(2));
          pickup.clear(2);
          debit.clear(2);
          credit.clear(2);
          balance.clear(2);
        }
        if  ( classes[1] != line.middle_name ) {
          if  ( classes[1] )  {
            this.line_out(`  ${classes[1]}合計`, pickup.sum(1),
            debit.sum(1), credit.sum(1), balance.sum(1));
            pickup.clear(1);
            debit.clear(1);
            credit.clear(1);
            balance.clear(1);
          }
          if  ( out_classes.length <= 2 )   {
            this.line_out(` 【${line.middle_name}】`, null, null, null, null);
          }
        }
        if  (( out_classes.length <= 2 ) &&
             ( line.minor_name != classes[2] ))    {
          this.line_out(line.minor_name, null, null, null, null);
        }
        this.line_out(`  ${line.name}`, numeric(line.pickup), line.debit, line.credit, line.balance);
        pickup.add(line.pickup);
        debit.add(line.debit);
        credit.add(line.credit);
        balance.add(line.balance)
        classes = [ line.major_name, line.middle_name, line.minor_name];
      }
    }
    if  ( classes[2] )  {
      this.line_out(`  ${classes[2]}計`,
      pickup.sum(2), debit.sum(2), credit.sum(2), balance.sum(2));
    }
    if  ( out_classes.length <= 1 )  {
      this.line_out(`  ${out_classes[0]}合計`,
      pickup.sum(0), debit.sum(0), credit.sum(0), balance.sum(0));
    }
    return  ({
      pickup: pickup.sum(0),
      debit: debit.sum(0),
      credit: credit.sum(0),
      balance: balance.sum(0)
    });
  }
  title_line(name)    {
    this.line_out(name, null, null, null, null);
  }
  assets_page()   {           //  貸借対照表 資産の部
    this.make_header('貸借対照表 資産の部');
    this.print(true , [ "資産" ]);
  }
  liabilities_and_capital_page()  {
    let cap = [];

    this.make_header('負債・資本の部');
    cap[0] = this.print(true, [ "負債" ]);
    this.title_line('【株主資本】');
    this.title_line('【資本金】');
    cap[1] = this.print(false, [ "純資産", "株主資本",	"資本金" ]);
    this.title_line("【資本剰余金】");
    cap[2] = this.print(false, [ "純資産",	"株主資本",	"資本剰余金" ]);
    this.title_line("【利益剰余金】");
    cap[3] = this.print(false, [ "純資産",	"株主資本",	"利益剰余金" ]);
    this.retained_earnings = cap[3];
    this.title_line("【自己株式】")
    cap[4] = this.print(false, [ "純資産", "自己株式", "自己株式" ])
    this.line_out('  株主資本合計',
      cap[1].pickup + cap[2].pickup + cap[3].pickup,
      cap[1].debit + cap[2].debit + cap[3].debit,
      cap[1].credit + cap[2].credit + cap[3].credit,
      cap[1].balance + cap[2].balance + cap[3].balance);
    this.line_out('  純資産合計',
      cap[1].pickup + cap[2].pickup + cap[3].pickup + cap[4].pickup,
      cap[1].debit + cap[2].debit + cap[3].debit + cap[4].debit,
      cap[1].credit + cap[2].credit + cap[3].credit + cap[4].credit,
      cap[1].balance + cap[2].balance + cap[3].balance + cap[4].balance);
    this.line_out('  負債・純資産合計',
      cap[0].pickup + cap[1].pickup + cap[2].pickup + cap[3].pickup + cap[4].pickup,
      cap[0].debit + cap[1].debit + cap[2].debit + cap[3].debit + cap[4].debit,
      cap[0].credit + cap[1].credit + cap[2].credit + cap[3].credit + cap[4].credit,
      cap[0].balance + cap[1].balance + cap[2].balance + cap[3].balance + cap[4].balance);
  }
  income_statement_page() {   //  損益計算書
    let sum = [];

    this.make_header('損益計算書');
    sum[0] = this.print(true, [ "経常損益", "売上高" ]);
    this.title_line('売上原価');
    sum[1] = this.print(true,[ "経常損益", "売上原価", "仕入高" ]);
    sum[2] = this.print(true,[ "経常損益", "売上原価", "外注費" ]);
    sum[3] = this.print(true,[ "経常損益", "売上原価", "棚卸高" ]);
    this.line_out("  売上総利益",
      null,
      null,
      null,
      sum[0].balance - ( sum[1].balance + sum[2].balance + sum[3].balance));
    this.title_line('販売費一般管理費');
    sum[4] = this.print(true,[ "経常損益", "売上原価", "販売費一般管理費" ]);
    this.line_out("  営業利益",
      null,
      null,
      null,
      sum[0].balance - ( sum[1].balance + sum[2].balance + sum[3].balance + sum[4].balance));
    sum[5] = this.print(true, [ "経常損益",	"営業外収益" ]);

    this.title_line("【営業外費用】");
    sum[6] = this.print(true, [ "経常損益",	"営業外費用", "支払利息" ]);
    sum[7] = this.print(true, [ "経常損益",	"営業外費用", "特別利益" ]);
    sum[8] = this.print(true, [ "経常損益",	"営業外費用", "特別損失" ]);

    //console.log('sum', sum);
    this.line_out("  経常利益",
      null,
      null,
      null,
      sum[0].balance - ( sum[1].balance + sum[2].balance + sum[3].balance + sum[4].balance )
        + sum[5].balance - sum[6].balance - sum[7].balance - sum[8].balance);

      this.title_line("【当期損益】");
      this.line_out("  税引前当期利益",
        null,
        null,
        null,
        ( sum[0].balance + sum[5].balance + sum[7].balance )
        - ( sum[1].balance + sum[2].balance + sum[3].balance + sum[4].balance + sum[6].balance + sum[8].balance ));

      sum[9] = this.account_line("法人税住民税等");
      //console.log('sum[9]', sum[9]);

      let current_net_income = ( sum[0].balance + sum[5].balance + sum[7].balance )
                             - ( sum[1].balance + sum[2].balance + sum[3].balance 
                                + sum[4].balance + sum[6].balance + sum[8].balance
                                + sum[9].balance);
      this.line_out("  当期純利益",
        null,
        null,
        null,
        current_net_income);
      let line = this._account_line('繰越利益剰余金');
      this.line_out('  前期繰越利益',
      this.line.pickup,
      this.line.debit,
      this.line.credit,
      this.line.balance)
      line.credit = current_net_income;
      line.balance = line.pickup - line.debit + line.credit;
      this.account_line('繰越利益剰余金')
    }
    run()   {
        this.assets_page();
        this.income_statement_page();
        this.liabilities_and_capital_page();
    }
}

/*
const TERM=14;

let book = new Book(TERM);
TrialBalance(TERM).then((lines) => {
    let trial_balance_page = new TrialBalancePage(book, TERM, lines);
    trial_balance_page.run();
    book.save('残高試算表.xlsx');
});
*/
export default async (term, month) => {
  console.log(term, month);
  let lastDate;
  if	( month )	{
    let ymd = month.split('-');
    lastDate = new Date(parseInt(ymd[0]), parseInt(ymd[1]), 1);
  }

  let book = new Book(term);
  let {lines} = await TrialBalance(term, lastDate);
  let trial_balance_page = new TrialBalancePage(book, term, lines, month);
  await trial_balance_page.run();
  return  book.book.xlsx.writeBuffer();
};
