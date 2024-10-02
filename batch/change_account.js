import models from '../models/index.js';

const   change_detail = (list) => {
    models.CrossSlipDetail.findAll().then((details) => {
        details.forEach((detail) => {
            let update = false;
            let i;
            let j;
            for ( i = 0; i < list.length; i += 1 )  {
                if  ( detail.debitAccount == list[i][0] )   break;
            }
            for ( j = 0; j < list.length; j += 1 )  {
                if  ( detail.creditAccount == list[j][0] )  break;
            }
            if  ( i < list.length ) {
                detail.debitAccount = list[i][1];
                update = true;
            }
            if  ( j < list.length ) {
                detail.creditAccount = list[j][1];
                update = true;
            }
            if  ( update )  {
                console.log(detail);
                detail.save();
            }
        });
    });
}

const   change_account = (list) => {
    models.Account.findAll().then((accounts) => {
        accounts.forEach((account) => {
            let i;
            for ( i = 0; i < list.length; i += 1 )  {
                if  ( account.accountCode == list[i][0] )   break;
            }
            if  ( i < list.length ) {
                account.accountCode = list[i][1];
                console.log(account);
                account.save();
            }
        })
    })
}

const   change_account_class = (list) => {
    models.AccountClass.findAll().then((table) => {
        table.forEach((item) => {
            let code = item.field.toString() + ( '00' + item.adding.toString() ).slice(-2);
            let i;
            for ( i = 0; i < list.length ; i += 1 ) {
                if  ( list[i][0] == code )  break;
            }
            if  ( i < list.length ) {
                item.field = list[i][1];
                item.adding = list[i][2];
                console.log(item);
                item.save();
            }
        });
    })
}

/*
change_account_class([
    [ '800', 8, 1],
    [ '801', 8, 2],
    [ '802', 8, 0]
]);
change_account([
    [ '8000000', '8010000' ],
    [ '8010000', '8020000' ],
    [ '8010010', '8020010' ],
    [ '8020000', '8000000' ]
])
change_account([
    [ '9010010', '9030000']
])
change_detail([
    [ '8000000', '8010000' ],
    [ '8010000', '8020000' ],
    [ '8010010', '8020010' ],
    [ '8020000', '8000000' ]
])
*/
change_detail([
    [ '9010010', '9030000' ]
])

