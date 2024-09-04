import models from '../models/index.js';
const Op = models.Sequelize.Op;
import Account from '../libs/accounts.js';
import AccountPage from './account_page.js';
import Ledger from './ledger_page.js';
import {Book} from './book.js';

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

export default async (term) => {
    let book = new Book(term);
    let accounts = await Account.all2(term);
    let account_page = new AccountPage(book, accounts);
    await account_page.run();
    let ledger = new Ledger(book, accounts);
    await ledger.all();
    return  book.book.xlsx.writeBuffer();
}

