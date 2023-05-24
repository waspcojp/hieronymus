const CrossSlipDetails = require('../libs/crossslipdetails');
const Account = require('../libs/accounts');
const {Page} = require('./book');
const {ledger_lines} = require('../libs/ledger');
const {set_accounts} = require('../front/javascripts/cross-slip');

class LedgerPage{
    constructor(book, account, subAccount) {
        if  ( subAccount )  {
            this.page = new Page(book, `${account.name} ${subAccount.name}`);
            this.balance = parseInt(subAccount.balance);
        } else {
            this.page = new Page(book, `${account.name}(${account.code})`);
            this.balance = parseInt(account.balance);
        }
        this.account = account;
        this.subAccount = subAccount;
        this.debit = 0;
        this.credit = 0;
    }
    make_header() {
        let sheet = this.page.sheet;
        sheet.columns = [
            { header: '日付', width: 5 },
            { header: '伝番', width: 4 },
            { header: '相手勘定科目', width: 16 },
            { header: '適用', key: 'application', width: 22, },
            { header: '税区分', width: 13},
            { header: '相手方税区分', width: 13},
            { header: '残高', width: 13 },
        ];
        sheet.getCell(2,3).value = '相手補助科目';
        sheet.getCell(3,5).value = '借方金額';
        sheet.getCell(3,6).value = '貸方金額';
        sheet.getCell(2,7).value = '';
        sheet.getCell(3,4).value = '補助科目'
        sheet.mergeCells('A1:A3');
        sheet.mergeCells('B1:B3');
        sheet.mergeCells('D1:D2');
        sheet.mergeCells('G1:G3');

        for ( let i = 1; i < 7; i ++ ) {
            sheet.getCell(1,i).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' }
                }
            };
        }
        sheet.getCell(1,7).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin'}
                }
        };
        for ( let i = 1; i < 7; i ++ ) {
            sheet.getCell(2,i).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    left: { style: 'thin' }
                }
            };
        }
        sheet.getCell(2,7).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    left: { style: 'thin' },
                    right: { style: 'thin'}
                }
        };
        for ( let i = 1; i < 7; i ++ ) {
            sheet.getCell(3,i).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    bottom: { style: 'thin'},
                    left: { style: 'thin' },
                }
            };
        }
        sheet.getCell(3,7).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            border: {
                bottom: { style: 'thin'},
                left: { style: 'thin' },
                right: { style: 'thin'}
            }
        };
        sheet.getCell(4, 4).value = '繰越金額'
        sheet.getCell(4, 7).value = this.balance;
        for ( let i = 1; i < 7; i ++ ) {
            sheet.getCell(4,i).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    bottom: { style: 'thin' },
                    left: { style: 'thin' }
                }
            };
        }
        sheet.getCell(4,7).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin'}
            },
            numFmt: '¥####,###,##0'
        };
    
        this.lineNo = 5;
        this.sheet = sheet;
    }
    print(line) {
        //console.log(detail);
        let sheet = this.page.sheet;
        sheet.getCell(this.lineNo, 1).value = `${line.month}/${line.day}`;
        sheet.mergeCells(this.lineNo, 1, this.lineNo+2, 1);
        sheet.getCell(this.lineNo, 1).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+1, 1).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+2, 1).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'},
                bottom: { style: 'thin'}
            }
        };

        sheet.getCell(this.lineNo, 2).value = line.no;
        sheet.mergeCells(this.lineNo, 2, this.lineNo+2, 2);
        sheet.getCell(this.lineNo, 2).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+1, 2).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+2, 2).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'},
                bottom: { style: 'thin'}
            }
        };

        sheet.getCell(this.lineNo  , 3).value = line.otherAccount;
        sheet.getCell(this.lineNo  , 4).value = line.application1;
        sheet.getCell(this.lineNo  , 5).value = line.thisTaxClass;
        sheet.getCell(this.lineNo  , 6).value = line.otherTaxClass;
        sheet.getCell(this.lineNo  , 7).value = '';

        sheet.getCell(this.lineNo+1, 3).value = line.otherSubAccount;
        sheet.getCell(this.lineNo+1, 4).value = line.application2;
        sheet.getCell(this.lineNo+1, 5).value = '';
        sheet.getCell(this.lineNo+1, 6).value = '';
        sheet.getCell(this.lineNo+1, 7).value = '';
        
        sheet.getCell(this.lineNo+2, 4).value = line.subAccount;
        if  ( line.debitAmount != '' )  {
            sheet.getCell(this.lineNo+2, 5).value = line.pureDebitAmount;
        }
        if  ( line.creditAmount != '' ) {
            sheet.getCell(this.lineNo+2, 6).value = line.pureCreditAmount;
        }
        sheet.getCell(this.lineNo+2, 7).value = line.pureBalance;

        sheet.getCell(this.lineNo, 3).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+1, 3).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+2, 3).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                left: { style: 'thin'},
                bottom: { style: 'thin'}
            }
        };

        sheet.getCell(this.lineNo  , 4).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+1, 4).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+2, 4).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                left: { style: 'thin'},
                bottom: { style: 'thin'}
            }
        };

        sheet.getCell(this.lineNo  , 5).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+1, 5).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+2, 5).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'middle'
            },
            border: {
                bottom: { style: 'thin'},
                left: { style: 'thin'}
            },
            numFmt: '¥#,##0'
        };

        sheet.getCell(this.lineNo  , 6).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+1, 6).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+2, 6).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'middle'
            },
            border: {
                left: { style: 'thin'},
                bottom: { style: 'thin'}
            },
            numFmt: '¥#,##0'
        };

        sheet.getCell(this.lineNo  , 7).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'left'
            },
            border: {
                right: { style: 'thin'},
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+1, 7).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'middle'
            },
            border: {
                right: { style: 'thin'},
                left: { style: 'thin'}
            }
        };
        sheet.getCell(this.lineNo+2, 7).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            },
            border: {
                left: { style: 'thin'},
                right: { style: 'thin'},
                bottom: { style: 'thin'}
            },
            numFmt: '¥#,##0'
        };

        this.lineNo +=3;
    }
    make_trailer(sums) {
        let sheet = this.page.sheet;
        sheet.getCell(this.lineNo, 4).value = '累計';
        sheet.getCell(this.lineNo, 5).value = sums.debitAmount;
        sheet.getCell(this.lineNo, 6).value = sums.creditAmount;
        sheet.getCell(this.lineNo, 7).value = sums.balance;
        for ( let i = 1; i <= 4; i ++ ) {
            sheet.getCell(this.lineNo,i).style = {
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                border: {
                    bottom: { style: 'thin' },
                    left: { style: 'thin' }
                }
            };
        }
        for ( let i = 5; i <= 6; i ++ ) {
            sheet.getCell(this.lineNo,i).style = {
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
        sheet.getCell(this.lineNo,7).style = {
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

    }
}
module.exports = class {
    constructor(book, accounts) {
        this.book = book;
        this.accounts = accounts;
        set_accounts(accounts);
    }
    async page(account, subAccount) {
        //console.log('account', account, subAccount);
        this.account = account;
        this.subAccount = subAccount;
        let fy = await this.book.fy;
        let sub_code = subAccount ? subAccount.code : null;
        let details = await CrossSlipDetails.all(fy, account.code, sub_code);
        if ( details.length > 0 ) {
            let this_page = new LedgerPage(this.book, account, subAccount);
            this_page.make_header();
            let ret;
            if  ( subAccount )  {
                ret = ledger_lines(account.code, subAccount.code, {
                    debit: 0,
                    credit: 0,
                    balance: this_page.balance }, details);
            } else {
                ret = ledger_lines(account.code, null, {
                    debit: 0,
                    credit: 0,
                    balance: this_page.balance }, details);
            }
            for ( let i = 0; i < ret.lines.length; i ++ ) {
                this_page.print(ret.lines[i]);
            }
            this_page.make_trailer(ret.sums);
        }
    }
    async all() {
        for ( let i = 0; i < this.accounts.length ; i ++ ) {
            await this.page(this.accounts[i]);
        }
    }
    async sub_all() {
        for ( let i = 0; i < this.accounts.length ; i ++ ) {
            if  ( this.accounts[i].subAccounts ) {
                for ( let j = 0; j < this.accounts[i].subAccounts.length; j ++ )    {
                    await this.page(this.accounts[i], this.accounts[i].subAccounts[j]);
                }
            }
        }
    }
};