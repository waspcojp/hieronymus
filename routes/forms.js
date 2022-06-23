const express = require('express');
const router = express.Router();
const {is_authenticated} = require('../libs/user');
const explanatory_journal = require('../forms/explanatory_journal');
const general_ledger = require('../forms/general_ledger');
const subsidiary_ledger = require('../forms/subsidiary_ledger');
const trial_balance = require('../forms/trial_balance');
const closing = require('../forms/closing');
const financial_statement = require('../forms/financial_statement');

router.get('/explanatory_journal/:term', is_authenticated, (req, res, next) => {
    explanatory_journal(req.params.term).then((buff) => {
        res.send(buff);
    })
});
router.get('/general_ledger/:term', is_authenticated, (req, res, next) => {
    general_ledger(req.params.term).then((buff) => {
        res.send(buff);
    })
});
router.get('/subsidiary_ledger/:term', is_authenticated, (req, res, next) => {
    subsidiary_ledger(req.params.term).then((buff) => {
        res.send(buff);
    })
});
router.get('/trial_balance/:term', is_authenticated, (req, res, next) => {
    trial_balance(req.params.term).then((buff) => {
        res.send(buff);
    })
});
router.get('/closing/:term', is_authenticated,(req, res, next) => {
    closing(req.params.term).then(() => {
        res.redirect('/');
    })

});
router.get('/financial_statement/:term', is_authenticated,(req, res, next) => {
    financial_statement(req.params.term).then((buff) => {
        res.send(buff);
    })
});

module.exports = router;