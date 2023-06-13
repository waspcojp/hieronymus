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
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscal_browsing )) {
        explanatory_journal(req.params.term).then((buff) => {
            res.send(buff);
        });
	} else {
		res.redirect('/home');
	}
});
router.get('/general_ledger/:term', is_authenticated, (req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscal_browsing )) {
        general_ledger(req.params.term).then((buff) => {
            res.send(buff);
        })
	} else {
		res.redirect('/home');
	}
});
router.get('/subsidiary_ledger/:term', is_authenticated, (req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscal_browsing )) {
        subsidiary_ledger(req.params.term).then((buff) => {
            res.send(buff);
        })
	} else {
		res.redirect('/home');
	}
});
router.get('/trial_balance/:term', is_authenticated, (req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscal_browsing )) {
        trial_balance(req.params.term).then((buff) => {
            res.send(buff);
        })
	} else {
		res.redirect('/home');
	}
});
router.get('/closing/:term', is_authenticated,(req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscal_browsing )) {
        closing(req.params.term).then(() => {
            res.redirect('/');
        })
	} else {
		res.redirect('/home');
	}
});
router.get('/financial_statement/:term', is_authenticated,(req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscal_browsing )) {
        financial_statement(req.params.term).then((buff) => {
            res.send(buff);
        })
	} else {
		res.redirect('/home');
	}
});

module.exports = router;