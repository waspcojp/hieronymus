import express from 'express';
const app = express();

import session from 'express-session';
import fileStore from 'session-file-store';
const FileStore = fileStore(session);
import passport from 'passport';
import multipart from 'connect-multiparty';

import cors from 'cors';
import sprightly from 'sprightly';
import path from 'path';

import apiRouter from './routes/api.js';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import homeRouter from './routes/home.js';
import formsRouter from './routes/forms.js';
import customerRouter from './routes/customer.js';
import voucherRouter from './routes/voucher.js';
import {is_authenticated} from './libs/user.js';

import env from './config/env.js';
global.env = env;

const __dirname = import.meta.dirname;

app.use(logger('dev'));		//	アクセスログを見たい時には有効にする
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
	origin: ['*']
}));
app.use(multipart());

app.use(session({
	secret: 'hieronymus',
	resave: true,
	saveUninitialized: false,
	name: 'hieronymus',					//	ここの名前は起動するnode.js毎にユニークにする
	store: new FileStore({
		ttl: global.env.session_ttl,	//	default 3600(s)
		reapInterval: global.env.session_ttl,
		path: global.env.session_path	//	default path
	}),

	cookie: {
		httpOnly: true,
		secure: false,
		maxage: null
	}
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('spy', sprightly);
app.set('views', './views');
app.set('view engine', 'spy');

app.use('/dist', express.static(path.join(__dirname, './dist')));
app.use('/style', express.static(path.join(__dirname, './front/stylesheets')));
app.use('/public', express.static(path.join(__dirname, './public')));

/*
app.use('/journal/:term', is_authenticated, (req, res, next) => {
	res.render('journal.spy', {
		term: req.params.term,
		user: User.current(req)
	});
});
*/
app.use('/journal/:year/:month', is_authenticated, (req, res, next) => {
	if ( req.session.user.accounting )	{
		res.render('journal.spy', {
			year: req.params.year,
			month: req.params.month,
			term: req.session.term,
			user: req.session.user.name
		});
	} else {
		res.redirect('/home');
	}
});

app.use('/ledger/:term/:account', is_authenticated, (req, res, next) => {
	if ( req.session.user.accounting )	{
		res.render('ledger.spy', {
			term: req.session.term,
			account: req.params.account,
			user: req.session.user.name
		});
	} else {
		res.redirect('/home');
	}
});
app.use('/changes/:term/:account', is_authenticated, (req, res, next) => {
	if ( req.session.user.accounting )	{
		res.render('changes.spy', {
			term: req.session.term,
			account: req.params.account,
			user: req.session.user.name
		});
	} else {
		res.redirect('/home');
	}
});
app.use('/bank-ledger/:term', is_authenticated, (req, res, next) => {
	if ( req.session.user.accounting )	{
		res.render('bank-ledger.spy', {
			term: req.session.term,
			account: req.params.account,
			user: req.session.user.name
		});
	} else {
		res.redirect('/home');
	}
});
app.use('/bank-ledger/:term/:account', is_authenticated, (req, res, next) => {
	if ( req.session.user.accounting )	{
		res.render('bank-ledger.spy', {
			term: req.session.term,
			account: req.params.account,
			user: req.session.user.name
		});
	} else {
		res.redirect('/home');
	}
});
app.use('/bank-ledger/:term/:account/:subaccount', is_authenticated, (req, res, next) => {
	if ( req.session.user.accounting )	{
		res.render('bank-ledger.spy', {
			term: req.session.term,
			account: req.params.account,
			user: req.session.user.name
		});
	} else {
		res.redirect('/home');
	}
});
app.use('/accounts/:term', is_authenticated, (req, res, next) => {
	if ( req.session.user.accounting )	{
		res.render('accounts.spy', {
			term: req.session.term,
			user: req.session.user.name
		});
	} else {
		res.redirect('/home');
	}
});
app.use('/trial-balance', is_authenticated,(req, res, next) => {
	if ( req.session.user.accounting )	{
		res.render('trial-balance.spy', {
			term: req.session.term,
			user: req.session.user.name
		});
	} else {
		res.redirect('/home');
	}
});
app.use('/users', is_authenticated,(req, res, next) => {
	if ( req.session.user.administrable)	{
		res.render('index.spy', {
			term: req.session.term
		});
	} else {
		res.redirect('/home');
	}
});
app.use('/invoices', is_authenticated,(req, res, next) => {
	if ( req.session.user.administrable)	{
		res.render('index.spy', {
			term: req.session.term
		});
	} else {
		res.redirect('/home');
	}
});

app.use('/customer', customerRouter);
app.use('/voucher', voucherRouter);
app.use('/forms', formsRouter);
app.use('/', homeRouter);
app.use('/api', apiRouter);

export default app;

