import CrossSlipDetails from '../libs/crossslipdetails.js';
import Account from '../libs/accounts.js';
import {Page} from './book.js';

export default class {
    constructor(book, accounts) {
        this.book = book;
        this.accounts = accounts;
        this.page = new Page(book, '勘定科目一覧');
    }
    make_header() {
        let sheet = this.page.sheet;
        sheet.columns = [
            { header: '科目コード', width: 10},
            { header: '勘定科目', width: 24},
            { header: '税区分', width: 6},
            { header: '借方', width: 14},
            { header: '貸方', width: 14},
            { header: '残高', width: 14}
        ];
        for ( let i = 1; i < 6; i ++ ) {
            sheet.getCell(1,i).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    top: { style: 'thin' },
                    bottom: { style: 'thin'},
                    left: { style: 'thin' }
                }
            };
        }
        sheet.getCell(1,6).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    top: { style: 'thin' },
                    bottom: { style: 'thin'},
                    left: { style: 'thin' },
                    right: { style: 'thin'}
                }
        };
    }
    async print(fy) {
        let sheet = this.page.sheet;
        let lineNo = 2;
        for ( let i = 0; i < this.accounts.length; i ++ ) {
            let account = this.accounts[i];
            sheet.getCell(lineNo, 1).value = parseInt(account.code);
            sheet.getCell(lineNo, 1).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'right'
                },
                border: {
                    left: { style: 'thin'},
                    bottom: { style: 'thin'}
                }
            }
            let details = await CrossSlipDetails.all(fy, account.code);
            if ( details.length == 0 ) {
                sheet.getCell(lineNo, 2).value = account.name;
            } else {
                sheet.getCell(lineNo, 2).value = {
                    text: account.name,
                    hyperlink: `#'${account.name}(${account.code})'!A1`
                };
            }
            sheet.getCell(lineNo, 2).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'left'
                },
                border: {
                    left: { style: 'thin'},
                    bottom: { style: 'thin'}
                }
            }
            sheet.getCell(lineNo, 3).value = Account.tax_class(account.taxClass);
            sheet.getCell(lineNo, 3).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    left: { style: 'thin'},
                    bottom: { style: 'thin'}
                }
            }
            sheet.getCell(lineNo, 4).value = parseInt(account.debit);
            sheet.getCell(lineNo, 4).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'right'
                },
                border: {
                    left: { style: 'thin'},
                    bottom: { style: 'thin'}
                },
                numFmt: '¥####,###,##0'
            }
            sheet.getCell(lineNo, 5).value = parseInt(account.credit);
            sheet.getCell(lineNo, 5).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'right'
                },
                border: {
                    left: { style: 'thin'},
                    bottom: { style: 'thin'}
                },
                numFmt: '¥####,###,##0'
            }
            sheet.getCell(lineNo, 6).value = parseInt(account.balance);
            sheet.getCell(lineNo, 6).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'right'
                },
                border: {
                    left: { style: 'thin'},
                    bottom: { style: 'thin'},
                    right: { style: 'thin'}
                },
                numFmt: '¥####,###,##0'
            }
            lineNo += 1;
        }        
    }
    async run () {
        let fy = await this.book.fy;
        this.make_header();
        await this.print(fy);
    }
}
