import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';
import explanatory_journal from '../forms/explanatory_journal.js';
import general_ledger from '../forms/general_ledger.js';
import subsidiary_ledger from '../forms/subsidiary_ledger.js';
import trial_balance from '../forms/trial_balance.js';
import closing from '../forms/closing.js';
import financial_statement from '../forms/financial_statement.js';

router.get('/explanatory_journal/:term', is_authenticated, (req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscalBrowsing )) {
        explanatory_journal(parseInt(req.params.term)).then((buff) => {
            res.send(buff);
        });
	} else {
		res.redirect('/home');
	}
});
router.get('/general_ledger/:term', is_authenticated, (req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscalBrowsing )) {
        general_ledger(parseInt(req.params.term)).then((buff) => {
            res.send(buff);
        })
	} else {
		res.redirect('/home');
	}
});
router.get('/subsidiary_ledger/:term', is_authenticated, (req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscalBrowsing )) {
        subsidiary_ledger(parseInt(req.params.term)).then((buff) => {
            res.send(buff);
        })
	} else {
		res.redirect('/home');
	}
});
router.get('/trial_balance/:term', is_authenticated, (req, res, next) => {
	if (( req.session.user.accounting ) ||
      ( req.session.user.fiscalBrowsing )) {
    trial_balance(parseInt(req.params.term)).then((buff) => {
      res.send(buff);
    })
	} else {
		res.redirect('/home');
	}
});
router.get('/trial_balance/:term/:month', is_authenticated, (req, res, next) => {
	if (( req.session.user.accounting ) ||
      ( req.session.user.fiscalBrowsing )) {
    trial_balance(parseInt(req.params.term), req.params.month).then((buff) => {
      res.send(buff);
    })
	} else {
		res.redirect('/home');
	}
});

router.get('/closing/:term', is_authenticated,(req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscalBrowsing )) {
        closing(parseInt(req.params.term)).then(() => {
            res.redirect('/');
        })
	} else {
		res.redirect('/home');
	}
});
router.get('/financial_statement/:term', is_authenticated,(req, res, next) => {
	if (( req.session.user.accounting ) ||
        ( req.session.user.fiscalBrowsing )) {
        financial_statement(parseInt(req.params.term)).then((buff) => {
            res.send(buff);
        })
	} else {
		res.redirect('/home');
	}
});

export default router;