const express = require('express');
const router = express.Router();
const {is_authenticated, passport} = require('../libs/user');
const models = require('../models');
const Op = models.Sequelize.Op;

router.get('/logout', (req, res, next) => {
	//console.log('logout', req.user);
	req.session.destroy();
	req.logout();
	res.redirect('/login');
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
		console.log('user', req.session.user);
		res.render('home', {
							title: 'Home',
							msg_type: '',
							message: '',
							term: req.session.term,
							user: req.session.user.name,
							administrable: req.session.user.administrable
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
router.get('/login', (req, res, next) => {
	res.render('index', {
		title: '',
		msg_type: '',
		message: ''
	});
});
router.get('/signup', (req, res, next) => {
	res.render('index', {
		title: '',
		msg_type: '',
		message: ''
	});
});

module.exports = router;
