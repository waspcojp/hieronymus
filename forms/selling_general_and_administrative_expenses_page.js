const {Book, Page} = require('./book');
const SumTable = require('./sum_table');
const {field, numeric} = require('../libs/parse_account_code');

module.exports = class {
    constructor(book, lines, accounts)    {
        this.accounts = accounts;
        this.book = book;
        this.lines = lines;
    }
    make_header() {
		let page = this.page;
		page.sheet.columns = [
			{ header: '科目', width: 32},
			{ header: '金額', width: 12}
		];
        page.set_cell(1, undefined, {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'thin' },
                left: { style: 'medium' }
            }
        });
        page.set_cell(2, undefined, {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'thin' },
				left: { style: 'thin' },
				right: { style: 'medium'}
            }
        });
		page.new_line();
	}
    detail_line(title, val)  {
        let page = this.page;
        page.set_cell(1, `    ${title}`, {
            border: {
                left: { style: 'medium' }
            }
        });
        page.set_cell(2, val, {
            format: '¥#,##0',
            border: {
                left: { style: 'thin' },
				right: { style: 'medium'}
            }
        });
        page.new_line();
    }
    sum_line(title, val)    {
        let page = this.page;
        page.set_cell(1, title, {
            border: {
                top: { style: 'thin'},
                left: { style: 'medium'},
                bottom: { style: 'medium'}
            }
        });
        page.set_cell(2, numeric(val), {
            format: '¥#,##0',
            border: {
                top: { style: 'thin'},
                left: { style: 'thin'},
                right: { style: 'medium'},
                bottom: { style: 'medium'}
            }
        });
        page.new_line();
    }
	print(out_classes)	{
        let page = this.page;
        let pickup = new SumTable(3);
        let debit = new SumTable(3);
        let credit = new SumTable(3);
        let balance = new SumTable(3)
        let classes = [];
        let supress = true;

        for ( let i = 0; i < this.lines.length ; i ++ ) {
            let line = this.lines[i];
            if  ( !line.code )  continue;
            if  (( out_classes[0] == '資産') &&
                 ( line.code == '1140000' ))    continue;
            if  (( out_classes[0] == '負債') &&
                 ( line.code == '3080000' ))    continue;
            if  ((( !supress ) ||
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
                    this.sum_line(classes[2], balance.sum(2));
                    pickup.clear(2);
                    debit.clear(2);
                    credit.clear(2);
                    balance.clear(2);
                }
                this.detail_line(line.name, line.balance);
                pickup.add(line.pickup);
                debit.add(line.debit);
                credit.add(line.credit);
                balance.add(line.balance)
                classes = [ line.major_name, line.middle_name, line.minor_name];
            } else {
                classes = [];
            }
        }
        return  ({
            pickup: pickup.sum(0),
            debit: debit.sum(0),
            credit: credit.sum(0),
            balance: balance.sum(0)
        });
    }
	run()	{
		this.page = new Page(this.book, "販売費及び一般管理費内訳書");
		this.make_header();
		let sum = this.print([ "経常損益", "売上原価", "販売費一般管理費" ]);
        this.sum_line('合計', sum.balance);
	}
}
