const models = require('../models');
const Op = models.Sequelize.Op;
const Account = require('../libs/accounts');
const AccountPage = require('./account_page');
const Ledger = require('./ledger_page');
const {Book} = require('./book');

const TERM=14;

/*
let book = new Book(TERM);
Account.all2(TERM).then((accounts) => {
    //console.log(accounts);
    let account_page = new AccountPage(book, accounts);
    account_page.run().then (() => {
        let legger = new Ledger(book, accounts);
        legger.all().then(() => {
            book.save("総勘定元帳.xlsx");
        });
    });
});
*/

module.exports = async (term) => {
    let book = new Book(term);
    let accounts = await Account.all2(term);
    let account_page = new AccountPage(book, accounts);
    await account_page.run();
    let ledger = new Ledger(book, accounts);
    await ledger.all();
    return  book.book.xlsx.writeBuffer();
}

