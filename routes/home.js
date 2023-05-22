const express = require('express');
const router = express.Router();
const {is_authenticated, User, passport} = require('../libs/user');
const models = require('../models');
const Op = models.Sequelize.Op;


/* GET users listing. */
router.get('/login', (req, res, next) => {
	res.render('login', { title: 'Login',
						  msg_type: '',
						  message: '',
						});
});

router.post('/login', (req, res, next) => {
	//console.log(req.body.user_name);
	//console.log(req.body.password);

	passport.authenticate('local', (error, user, info) => {
		//console.log('error', error);
		//console.log('user', user);
		//console.log('info', info);
		if (error) {
			return next(error);
		}
		if ( !user ) {
			//console.log('user not found');
			res.render('login', { title: 'Login',
								  msg_type: 'danger',
								  message: `user ${user.user_name} not found`
								});
		} else {
			req.login(user, (error, next) => {
				console.log('/login user', user);
				//console.log("error", error);
				if (error) {
					//console.log("error");
					res.render('login', { title: 'Login',
										  msg_type: 'danger',
										  message: `user ${user.user_name} not found`
										});
				} else {
					res.redirect('/home');
				}
			});
		}
	})(req, res, next);
});

router.get('/logout', (req, res, next) => {
	//console.log('logout', req.user);
	req.session.destroy();
	req.logout();
	res.redirect('/login');
});

router.get('/signup', (req, res, next) => {
	res.render('signup', { title: 'Signup',
						   msg_type: '',
						   message: ''
						});
});

router.post('/signup', (req, res, next) => {
	//console.log(req.body.user_name);
	//console.log(req.body.password);

	user_name = req.body.user_name;
	password = req.body.password;
	if ( !User.check(user_name) ) {
		user = new User(user_name, {
			name: user_name
		})
		user.password = password;
		models.User.count().then((count) => {
			if	( count === 0 )	{
				user.administratable = true;
				user.approvable = true;
				user.inventory = true;
			} else {
				user.administratable = false;
				user.approvable = false;
				user.inventory = false;
			}
			user.create().then((ret) => {
				res.redirect('/login');
			});
		});
		//console.log('signup_post fine');
	} else {
		//console.log('user duplicate', user_name);
		res.render('signup', { msg_type: 'danger',
							   message: `user ${user_name} duplicated`
							 });
	}
});

const home =  async (req, res, next) => {
	//console.log('term', req.params.term, req.session.term);
	if	( !req.params.term )	{
		if	( !req.session.term )	{
			let now = new Date('2020-10-10');	//	dummy
			//console.log(now);
			let fy = await models.FiscalYear.findOne({
				where: {
					[Op.and]:	{
						startDate: {
							[Op.lte]: now
						},
						endDate: {
							[Op.gte]: now
						}
					}
				}
			});
			//console.log(fy);
			if	( fy )	{
				req.session.term = fy.term;
			} else {
				req.session.term = 15;
			}
		}
		//console.log('term', req.session.term);
		res.render('home', {
							title: 'Home',
							msg_type: '',
							message: '',
							term: req.session.term,
							user: User.current(req).user_name
						});
	} else {
		req.session.term = req.params.term;
		req.session.save(() => {
			res.redirect('/home');
		});
	}
};

router.get('/', is_authenticated, home);
router.get('/home/:term', is_authenticated, home);
router.get('/home', is_authenticated, home);

module.exports = router;
