import {Book, Page} from './book.js';
import SumTable from './sum_table.js';
import {field, numeric} from '../libs/parse_account_code.js';

export default class {
    constructor(book, lines, accounts)    {
        this.accounts = accounts;
        this.book = book;
        this.lines = lines;
    }
    make_assets_header() {
        let page = this.page;
        page.sheet.columns = [
            { width: 32 },
            { width: 16 },
            { width: 32 },
            { width:  16 },
        ];
        page.set_cell(1, '資産の部', {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'medium' },
                left: { style: 'medium' }
            }
        });
        page.sheet.mergeCells('A1:B1');
        page.new_line();
        page.set_cell(1, '科目', {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'thin' },
                left: { style: 'medium' }
            }
        });
        page.set_cell(2, '金額', {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'medium' },
                left: { style: 'thin' }
            }
        });
        page.new_line();
    }
    make_liabilities_header()   {
        let page = this.page;
        page.set_line(1);
        page.set_cell(3, '負債の部', {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'medium' },
                left: { style: 'medium' }
            }
        });
        page.sheet.mergeCells('C1:D1');
        page.new_line();
        page.set_cell(3, '科目', {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'thin' },
                left: { style: 'medium' }
            }
        });
        page.set_cell(4, '金額', {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'medium' },
                left: { style: 'thin' }
            }
        });
        page.new_line();
    }
    make_net_worth_header() {
        let page = this.page;
        page.set_cell(3, '純資産の部', {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'medium' },
                left: { style: 'medium' }
            }
        });
        page.sheet.mergeCells(`C${this.page.lineNo}:D${this.page.lineNo}`);
        page.new_line();
    }
    title_line(title, val)  {
        let page = this.page;
        if  ( this.left )   {
            page.set_cell(1, title, {
                border: {
                    left: { style: 'medium' }
                }
            });
            page.set_cell(2, numeric(val), {
                format: '¥#,##0',
                border: {
                    left: { style: 'thin' },
                    right: { style: 'medium' },
                }
            });
        } else {
            page.set_cell(3, title, {
                border: {
                    left: { style: 'medium' }
                }
            });
            page.set_cell(4, numeric(val), {
                format: '¥#,##0',
                border: {
                    left: { style: 'thin' },
                    right: { style: 'medium' },
                }
            });
        }
        page.new_line();
    }
    detail_line(title, val)  {
        let page = this.page;
        if  ( this.left )   {
            page.set_cell(1, '   ' + title, {
                border: {
                    left: { style: 'medium' }
                }
            });
            page.set_cell(2, numeric(val), {
                format: '¥#,##0',
                border: {
                    left: { style: 'thin' },
                    right: { style: 'medium' },
                }
            });
        } else {
            page.set_cell(3, '   ' + title, {
                border: {
                    left: { style: 'medium' }
                }
            });
            page.set_cell(4, numeric(val), {
                format: '¥#,##0',
                border: {
                    left: { style: 'thin' },
                    right: { style: 'medium' },
                }
            });
        }
        page.new_line();
    }
    sum_line(title, val)    {
        let page = this.page;
        if  ( this.left )   {
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
        } else {
            page.set_cell(3, title, {
                border: {
                    top: { style: 'thin'},
                    left: { style: 'medium'},
                    bottom: { style: 'medium'}
                }
            });
            page.set_cell(4, numeric(val), {
                format: '¥#,##0',
                border: {
                    top: { style: 'thin'},
                    left: { style: 'thin'},
                    right: { style: 'medium'},
                    bottom: { style: 'medium'}
                }
            });
        }
        page.new_line();
    }
    space_line()    {
        let page = this.page;
        if  ( this.left )   {
            page.set_cell(1, '', {
                border: {
                    left: { style: 'medium'}
                }
            });
            page.set_cell(2, '', {
                border: {
                    left: { style: 'thin'},
                    right: { style: 'medium'}
                }
            });
        } else {
            page.set_cell(3, '', {
                border: {
                    left: { style: 'medium'}
                }
            });
            page.set_cell(4, '', {
                format: '¥#,##0',
                border: {
                    left: { style: 'thin'},
                    right: { style: 'medium'}
                }
            });
        }
        page.new_line();
    }
    print(out_classes) {
        let page = this.page;
        let pickup = new SumTable(3);
        let debit = new SumTable(3);
        let credit = new SumTable(3);
        let balance = new SumTable(3)
        let classes = [];
        let mark;
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
                    this.detail_line(classes[2], balance.sum(2));
                    pickup.clear(2);
                    debit.clear(2);
                    credit.clear(2);
                    balance.clear(2);
                }
                if  ( classes[1] != line.middle_name ) {
                    if  ( classes[1] )  {
                        if  ( mark )    {
                            let next = page.new_line();
                            page.set_line(mark);
                            this.title_line(`【${classes[1]}】`, balance.sum(1));
                            page.set_line(next);
                        }
                        pickup.clear(1);
                        debit.clear(1);
                        credit.clear(1);
                        balance.clear(1);
                        mark = page.lineNo;
                    }

                }
                pickup.add(line.pickup);
                debit.add(line.debit);
                credit.add(line.credit);
                balance.add(line.balance)
                classes = [ line.major_name, line.middle_name, line.minor_name];
            } else {
                if  ( classes[2] )  {
                    this.detail_line(classes[2], balance.sum(2));
                }
                classes = [];
            }
        }
        if  ( mark )    {
            let next = page.new_line();
            page.set_line(mark);
            this.title_line(`【${classes[1]}】`, balance.sum(1));
            page.set_line(next);
        }
        return  ({
            pickup: pickup.sum(0),
            debit: debit.sum(0),
            credit: credit.sum(0),
            balance: balance.sum(0)
        });
    }
    assets()    {
        this.left = true;
        let sum = [];
        this.page = new Page(this.book, "貸借対照表");
        let page = this.page;
        this.make_assets_header();
        let floating_asset_line = page.new_line();
        sum[0] = this.print(['資産', '流動資産']);
        let fixed_asset_line = page.new_line();

        page.set_line(floating_asset_line);
        this.title_line('【流動資産】', sum[0].balance);
        page.set_line(fixed_asset_line);

        fixed_asset_line = page.new_line();

        {
            let mark = page.new_line();
            sum[1] = this.print( ['資産', '有形固定資産']);
            if  ( sum[1].balance ) {
                let next = page.new_line();
                page.set_line(mark);
                this.title_line('(有形固定資産)', sum[1].balance);
                page.set_line(next);
            } else {
                page.set_line(mark);
            }
        }
        {
            let mark = page.new_line();
            sum[2] = this.print(['資産', '無形固定資産']);
            if  ( sum[2].balance ) {
                let next = page.new_line();
                page.set_line(mark);
                this.title_line('(無形固定資産)', sum[2].balance);
                page.set_line(next);
            } else {
                page.set_line(mark);
            }
        }
        {
            let mark = page.new_line();
            sum[3] = this.print(['資産', '投資等']);
            let next = page.new_line();
            page.set_line(mark);
            this.title_line('(投資その他資産)', sum[3].balance);
            page.set_line(next);
        }
        page.set_line(fixed_asset_line);
        this.title_line('【固定資産】', sum[1].balance + sum[2].balance + sum[3].balance);
        this.asset = sum[0].balance + sum[1].balance + sum[2].balance + sum[3].balance;
        return  (this.page.lineNo);
    }
    liabilities()   {
        this.left = false;
        let sum = [];
        let page = this.page;

        this.make_liabilities_header();
        {
            let mark = page.new_line();
            sum[0] = this.print(['負債', '流動負債']);
            if  ( sum[0].balance )  {
                let next = page.new_line();
                page.set_line(mark);
                this.title_line('【流動負債】', sum[0].balance);
                page.set_line(next);
            } else {
                page.set_line(mark);
            }
        }
        {   let mark = page.new_line();
            sum[1] = this.print(['負債', '固定負債']);
            if  ( sum[1].balance )  {
                let next = page.new_line();
                page.set_line(mark);
                this.title_line('【固定負債】', sum[1].balance);
                page.set_line(next);
            } else {
                page.set_line(mark);
            }
        }
        this.sum_line('負債合計', (sum[0].balance + sum[1].balance));
        this.space_line();
        this.space_line();
        return (sum[0].balance + sum[1].balance);
    }
    net_worth() {
        this.left = false;
        let page = this.page;
        let sum = [];

        this.make_net_worth_header();
        {
            let mark = page.new_line();
            sum[0] = this.print(['純資産', '株主資本', '資本金']);
            sum[1] = this.print(['純資産', '株主資本', '利益剰余金']);
            let next = page.new_line();
            page.set_line(mark);
            this.title_line('【株主資本】', ( sum[0].balance + sum[1].balance ) );
            page.set_line(next);
        }
        this.sum_line('純資産合計', (sum[0].balance + sum[1].balance));
        return  (sum[0].balance + sum[1].balance)
    }
    liabilities_and_net_worth() {
        let sum;
        sum  = this.liabilities();
        sum += this.net_worth();
        this.sum_line('負債・純資産合計', sum);
        return  (this.page.lineNo);
    }
    run()   {
        let left_lines = this.assets();
        let right_lines = this.liabilities_and_net_worth();
        this.left = true;
        let page = this.page;
        page.set_line(left_lines);
        for ( let i = left_lines ; i < right_lines - 1 ; i += 1)    {
            this.space_line();
        }
        this.sum_line('資産合計', this.asset);
    }
}
