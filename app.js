const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const multipart = require('connect-multiparty');

const cors = require('cors');
const sprightly = require('sprightly');
const path = require('path');

const apiRouter = require('./routes/api');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const homeRouter = require('./routes/home');
const formsRouter = require('./routes/forms');
const customerRouter = require('./routes/customer');
const voucherRouter = require('./routes/voucher');
const {User, is_authenticated} = require('./libs/user');

global.env = require('./config/env');

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

app.use('/api', apiRouter);

/*
app.use('/journal/:term', is_authenticated, (req, res, next) => {
	res.render('journal.spy', {
		term: req.params.term,
		user: User.current(req)
	});
});
*/
app.use('/journal/:year/:month', is_authenticated, (req, res, next) => {
	res.render('journal.spy', {
		year: req.params.year,
		month: req.params.month,
		term: req.session.term,
		user: req.session.user.name
	});
});

app.use('/ledger/:term/:account', is_authenticated, (req, res, next) => {
	res.render('ledger.spy', {
		term: req.session.term,
		account: req.params.account,
		user: req.session.user.name
	});
});
app.use('/bank-ledger/:term', is_authenticated, (req, res, next) => {
	res.render('bank-ledger.spy', {
		term: req.session.term,
		account: req.params.account,
		user: req.session.user.name
	});
});
app.use('/bank-ledger/:term/:account', is_authenticated, (req, res, next) => {
	res.render('bank-ledger.spy', {
		term: req.session.term,
		account: req.params.account,
		user: req.session.user.name
	});
});
app.use('/bank-ledger/:term/:account/:subaccount', is_authenticated, (req, res, next) => {
	res.render('bank-ledger.spy', {
		term: req.session.term,
		account: req.params.account,
		user: req.session.user.name
	});
});
app.use('/accounts/:term', is_authenticated, (req, res, next) => {
	res.render('accounts.spy', {
		term: req.session.term,
		user: req.session.user.name
	});
});
app.use('/trial-balance', is_authenticated,(req, res, next) => {
	res.render('trial-balance.spy', {
		term: req.session.term,
		user: req.session.user.name
	});
});
app.use('/users', is_authenticated,(req, res, next) => {
	res.render('users.spy', {
		term: req.session.term,
		user: req.session.user.name
	});
});

app.use('/customer', customerRouter);
app.use('/voucher', voucherRouter);
app.use('/forms', formsRouter);

app.use('/', homeRouter);

module.exports = app;
