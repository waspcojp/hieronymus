import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';
import explanatory_journal from '../forms/explanatory_journal.mjs';
import general_ledger from '../forms/general_ledger.mjs';
import subsidiary_ledger from '../forms/subsidiary_ledger.mjs';
import trial_balance from '../forms/trial_balance.mjs';
import closing from '../forms/closing.mjs';
import financial_statement from '../forms/financial_statement.mjs';

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

export default router;