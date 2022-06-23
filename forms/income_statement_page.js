const Account = require('../libs/accounts');
const {Book, Page} = require('./book');

module.exports = class {
    constructor(book, lines, accounts)    {
        this.accounts = accounts;
        this.book = book;
        this.lines = lines;
    }
    make_header() {
        let page = this.page;
        page.sheet.columns = [
            { header: '科目', width: 20 },
            { header: '', width: 20 },
            { header: '金額', width: 12 },
            { header: '',    width:  12 },
        ];
        page.set_cell(1, undefined, {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
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
                bottom: { style: 'medium' }
            }
        });
        page.set_cell(3, undefined, {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                left: { style: 'medium' },
                right: { style: 'medium'}
            }
        });
        page.set_cell(4, undefined, {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    top: { style: 'medium' },
                    bottom: { style: 'medium' },
                    right: { style: 'medium'}
                }
        });
        page.sheet.mergeCells('A1:B1');
        page.sheet.mergeCells('C1:D1');
        this.line = {};
        page.new_line();
    }
    title_line(title)   {
        let page = this.page;
        page.set_cell(1, title, {
            border: {
                left: { style: 'medium' }
            }
        });
        page.set_cell(2, '', {
        });
        page.set_cell(3, '', {
            border: {
                left: { style: 'medium' }
            }
        });
        page.set_cell(4, '',  {
            border: {
                left: { style: 'thin' },
                right: { style: 'medium' }
            }
        });
        page.new_line();
    }
    detail(left_title, right_title, left_value, right_value, left_line, right_line) {
        let page = this.page;
        page.set_cell(1, left_title, {
            border: {
                left: { style: 'medium' }
            }
        });
        page.set_cell(2, right_title, {
        });
        if  ( left_value )    {
            if  ( left_line )   {
                page.set_cell(3, left_value, {
                    format: '¥#,##0',
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'medium' },
                        right: { style: 'thin' }
                    }
                });
            } else {
                page.set_cell(3, left_value, {
                    format: '¥#,##0',
                    border: {
                        left: { style: 'medium' },
                        right: { style: 'thin' }
                    }
                });
            }
        } else {
            if  ( left_line )   {
                page.set_cell(3, '', {
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'medium' },
                        right: { style: 'thin' }
                    }
                });
            } else {
                page.set_cell(3, '', {
                    border: {
                        left: { style: 'medium' },
                        right: { style: 'thin' }
                    }
                });
            }
        }
        if  ( right_value)  {
            if ( right_line ) {
                page.set_cell(4, right_value, {
                    format: '¥#,##0',
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'medium' }
                    }
                });
            } else {
                page.set_cell(4, right_value, {
                    format: '¥#,##0',
                    border: {
                        left: { style: 'thin' },
                        right: { style: 'medium' }
                    }
                });
            }
        } else {
            if  ( right_line )   {
                page.set_cell(4, '', {
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'medium' }
                    }
                });
            } else {
                page.set_cell(4, '', {
                    border: {
                        left: { style: 'thin' },
                        right: { style: 'medium' }
                    }
                });
            }
        }
        page.new_line();
    }
    item(out_classes)   {
        let sums = {
            debit: 0,
            credit: 0,
            balance: 0
        }
        for ( line of this.lines )  {
            if      ( ( ( line.debit != 0 ) ||
                        ( line.credit != 0 ) ||
                        ( line.balance != 0 ) ) &&
                      ( line.acl_code.match(out_classes) ) )    {
                this.detail(line.name, '', line.balance, undefined, false, false);
                sums.debit += line.debit;
                sums.credit += line.credit;
                sums.balance += line.balance;
            }
        }
        return  (sums);
    }
    sum(code)   {
        let sums = {
            debit: 0,
            credit: 0,
            balance: 0
        }
        for ( line of this.lines )  {
            if      ( ( ( line.debit != 0 ) ||
                        ( line.credit != 0 ) ||
                        ( line.balance != 0 ) ) &&
                      ( line.code.match(code) ) )    {
                sums.debit += line.debit;
                sums.credit += line.credit;
                sums.balance += line.balance;
            }
        }
        return  (sums);
    }
    run()   {
        this.page = new Page(this.book, "損益計算書");
        let page = this.page;
        this.make_header();
        this.title_line("【売上高】")
        let gross_margin_line = this.sum(/^600/).balance;
        this.detail("売上高", '', gross_margin_line, gross_margin_line, false, false);
        this.detail('', '', undefined, undefined, true, false);

        this.title_line("【売上原価】");
        let purchase = this.sum(/^700/).balance;
        let subcontract = this.sum(/^701/).balance;       //  debit only
        let opening_inventory = this.sum(/7020000/).balance;
        let closing_inventory = this.sum(/7020010/).credit;
        let cogs = opening_inventory + purchase + subcontract;
        this.detail('    期首商品棚卸高', '', opening_inventory, undefined, false, false);
        this.detail('    仕入高', '', purchase, undefined, false, false);
        this.detail('    外注費', '', subcontract, undefined, false, false);
        this.detail("    売上原価計", '', cogs , undefined, true, false);
        this.detail("    期末商品棚卸高", '', closing_inventory, ( cogs - closing_inventory ), false, false);
        let gross_operating_profit = gross_margin_line - ( cogs - closing_inventory );
        this.detail('', "売上総利益", undefined,
                gross_operating_profit, true, true);

        let sga = this.sum(/^703/).balance;
        this.detail("【販売費及び一般管理費】", undefined, sga, false, false);

        let operating_profit = gross_operating_profit - sga;
        this.detail('', "営業利益", undefined, operating_profit, false, true);

        this.title_line("【営業外収益】");
        let non_operating_income = this.item(/^8/).balance;
        this.detail("    営業外収益計", '', undefined, non_operating_income, true, true);

        this.title_line("【営業外費用】");
        let non_operating_expenses = this.item(/^900|^902/).balance;
        this.detail("    営業外費用計", '', undefined, non_operating_expenses, true, true);

        let extraordinary_gain = this.sum(/^901/).balance;              //   特別利益
        if ( extraordinary_gain != 0 )    {
            this.detail("特別利益計", '', extraordinary_gain, undefined, true, false);
        }
        let extraordinary_loss = this.sum(/^902/).balance               //  特別損失
        if ( extraordinary_loss != 0 )    {
            this.detail("特別損失計", '', undefined, extraordinary_loss, true, true);
        }

        this.title_line("【当期損益】");
        let current_income = operating_profit
                        +    non_operating_income
                        -    non_operating_expenses
                        +    extraordinary_gain;
        let recurring_profit = operating_profit
                             + non_operating_income
                             - non_operating_expenses;
        this.detail('', "経常利益", undefined, recurring_profit, true, true);
        this.detail('', "税引前当期利益", undefined, current_income, false, true);

        let cit = this.sum(/^903/).balance;
        this.detail('', "法人税住民税等", undefined, cit, false, false);

        let net_income = current_income - cit;
        this.detail('', "当期純利益", undefined, net_income, false, true)
        page.set_cell(1, '', {
            border: {
                top: { style: 'medium' }
            }
        });
        page.set_cell(2, '', {
            border: {
                top: { style: 'medium' }
            }
        });
        page.set_cell(3, '', {
            border: {
                top: { style: 'medium' }
            }
        });
        page.set_cell(4, '', {
            border: {
                top: { style: 'medium' }
            }
        });
        page.new_line();
    }
}
