import ExcelJS from 'exceljs';
import models from '../models/index.js';
const Op = models.Sequelize.Op;
import Account from '../libs/accounts.js';

class ExplanatoryJournal {
    constructor(term) {
        this.book = new ExcelJS.Workbook();
        this.fy = models.FiscalYear.findOne({
            where: {
                term: term
            }
        });
    }
    make_header(sheet) {
        sheet.columns = [
            { header: '日付', key: 'date', width: 6 },
            { header: '伝番', key: 'no', width: 4 },
            { header: '借方金額', key: 'debit_amount', width: 11 },
            { header: '借方科目', key: 'debit_account', width: 16 },
            { header: '適用', key: 'application', width: 25, },
            { header: '貸方科目', key: 'credit_account', width: 16 },
            { header: '貸方金額', key: 'credit_amount', width: 11 }
        ];
        for ( let i = 1; i < 7; i ++ ) {
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
        sheet.getCell(1,7).style = {
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
    async make_journal(sheet, date) {
        let slips = await models.CrossSlip.findAll({
            where: {
                [Op.and]: {
                    year: date.year,
                    month: date.month
                }
            },
            order: [
                [ 'year', 'ASC'],
                [ 'month', 'ASC'],
                [ 'day', 'ASC' ],
                [ 'no', 'ASC' ]
            ]
        });
        let lineNo = 2;
        let sum = {
            debitAmount: 0,
            debitTax: 0,
            creditAmount: 0,
            creditTax: 0
        }
        for ( let i = 0; i < slips.length; i ++ ) {
            let slip = slips[i];
            let details = await models.CrossSlipDetail.findAll({
                where: {
                    crossSlipId: slip.id
                },
                order: [
                    ['lineNo', 'ASC']
                ]
            });
            for ( let j = 0; j < details.length; j ++ ) {
                let detail = details[j];
                sheet.getCell(lineNo, 1).value = `${slip.month}/${slip.day}`;
                sheet.getCell(lineNo, 1).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'right'
                    } ,
                    border: {
                        left: { style: 'thin' }
                    }
                };
                sheet.getCell(lineNo, 2).value = slip.no;
                sheet.getCell(lineNo, 2).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'center'
                    } ,
                    border: {
                        left: { style: 'thin' }
                    }
                };
 
                if ( detail.debitAmount ) {
                    sheet.getCell(lineNo, 3).value = parseInt(detail.debitAmount);
                    sum.debitAmount += parseInt(detail.debitAmount);
                } else {
                    sheet.getCell(lineNo, 3).value = '';
                }
                sheet.getCell(lineNo, 3).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'right'
                    } ,
                    border: {
                        left: { style: 'thin' }
                    },
                    numFmt: '¥#,##0'
                };
                sheet.getCell(lineNo, 4).value = Account.name(detail.debitAccount);
                sheet.getCell(lineNo, 4).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'left'
                    } ,
                    border: {
                        left: { style: 'thin' }
                    }
                };
                sheet.getCell(lineNo, 5).value = detail.application1;
                sheet.getCell(lineNo, 5).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'left'
                    } ,
                    border: {
                        left: { style: 'thin' }
                    }
                };
                sheet.getCell(lineNo, 6).value = Account.name(detail.creditAccount);
                sheet.getCell(lineNo, 6).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'left'
                    } ,
                    border: {
                        left: { style: 'thin' }
                    }
                };
                if ( detail.creditAmount ) {
                    sheet.getCell(lineNo, 7).value = parseInt(detail.creditAmount);
                    sum.creditAmount += parseInt(detail.creditAmount);
                } else {
                    sheet.getCell(lineNo, 7).value = '';
                }
                sheet.getCell(lineNo, 7).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'right'
                    } ,
                    border: {
                        left: { style: 'thin' },
                        right: { style: 'thin' }
                    },
                    numFmt: '¥#,##0'
                };
                lineNo += 1;
                sheet.getCell(lineNo, 1).style = {
                    border: {
                        left: { style: 'thin' },
                        bottom: { style: 'thin' }
                    }
                };
                sheet.getCell(lineNo, 2).style = {
                    border: {
                        left: { style: 'thin' },
                        bottom: { style: 'thin' }
                    }
                };
                if ( detail.debitTax ) {
                    sheet.getCell(lineNo, 3).value = parseInt(detail.debitTax);
                    sum.debitTax += parseInt(detail.debitTax);
                } else {
                    sheet.getCell(lineNo, 3).value = '';
                }
                sheet.getCell(lineNo, 3).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'right'
                    } ,
                    border: {
                        left: { style: 'thin' },
                        bottom: { style: 'thin' }
                    },
                    numFmt: '¥#,##0'
                };
                sheet.getCell(lineNo, 4).value = Account.sub_name(detail.debitAccount, detail.debitSubAccount);
                sheet.getCell(lineNo, 4).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'left'
                    } ,
                    border: {
                        left: { style: 'thin' },
                        bottom: { style: 'thin' }
                    }
                };
                sheet.getCell(lineNo, 5).value = detail.application2;
                sheet.getCell(lineNo, 5).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'left'
                    } ,
                    border: {
                        left: { style: 'thin' },
                        bottom: { style: 'thin' }
                    }
                };
                sheet.getCell(lineNo, 6).value = Account.sub_name(detail.creditAccount, detail.creditSubAccount);
                sheet.getCell(lineNo, 6).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'left'
                    } ,
                    border: {
                        left: { style: 'thin' },
                        bottom: { style: 'thin' }
                    }
                };
                if ( detail.creditTax ) {
                    sheet.getCell(lineNo, 7).value = parseInt(detail.creditTax);
                    sum.creditTax += parseInt(detail.creditTax);
                } else {
                    sheet.getCell(lineNo, 7).value = '';
                }
                sheet.getCell(lineNo, 7).style = {
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'right'
                    } ,
                    border: {
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                        bottom: { style: 'thin' }
                    },
                    numFmt: '¥#,##0'
                };
                lineNo += 1;
            }
        }
        sheet.getCell(lineNo, 1).style = {
            border: {
                left: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 2).style = {
            border: {
                left: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 3).value = sum.debitAmount;
        sheet.getCell(lineNo, 3).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            } ,
            border: {
                left: { style: 'thin' }
            },
            numFmt: '¥#,##0'
        };
        sheet.getCell(lineNo, 4).style = {
            border: {
                left: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 5).value = '合計';
        sheet.getCell(lineNo, 5).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            } ,
            border: {
                left: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 6).style = {
            border: {
                left: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 7).value = sum.creditAmount;
        sheet.getCell(lineNo, 7).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            } ,
            border: {
                left: { style: 'thin' },
                right: { style: 'thin' }
            },
            numFmt: '¥#,##0'
        };
        lineNo += 1;
        sheet.getCell(lineNo, 1).style = {
            border: {
                left: { style: 'thin' },
                bottom: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 2).style = {
            border: {
                left: { style: 'thin' },
                bottom: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 3).value = sum.debitTax;
        sheet.getCell(lineNo, 3).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            } ,
            border: {
                left: { style: 'thin' },
                bottom: { style: 'thin' }
            },
            numFmt: '¥#,##0'
        };
        sheet.getCell(lineNo, 4).style = {
            border: {
                left: { style: 'thin' },
                bottom: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 5).style = {
            border: {
                left: { style: 'thin' },
                bottom: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 6).style = {
            border: {
                left: { style: 'thin' },
                bottom: { style: 'thin' }
            }
        };
        sheet.getCell(lineNo, 7).value = sum.creditTax;
        sheet.getCell(lineNo, 7).style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'right'
            } ,
            border: {
                left: { style: 'thin' },
                right: { style: 'thin' },
                bottom: { style: 'thin' }
            },
            numFmt: '¥#,##0'
        };
    }
    async run () {
        let fy = await this.fy;
        await Account.all();
        for ( let mon = new Date(fy.startDate); mon < new Date(fy.endDate); ) {
            let date = {
                year: mon.getFullYear(),
                month: mon.getMonth() + 1
            };
            let sheet = this.book.addWorksheet(`${date.month}月度`);
            this.make_header(sheet);
            await this.make_journal(sheet, date);
            mon.setMonth(mon.getMonth() + 1);
        }
    }
    save(name) {
        console.log('saving')
        this.book.xlsx.writeFile(name);
    }
}

/*
let sheet = new ExplanatoryJournal(TERM);
sheet.run().then (() => {
    sheet.save("仕訳日記帳.xlsx");
});
*/

export default async (term) => {
    let sheet = new ExplanatoryJournal(term);
    await sheet.run();
    return  sheet.book.xlsx.writeBuffer();
}