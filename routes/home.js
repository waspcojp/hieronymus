import express from 'express';
const router = express.Router();
import {is_authenticated, passport} from '../libs/user.js';
import models from '../models/index.js';
const Op = models.Sequelize.Op;

router.get('/logout', (req, res, next) => {
	//console.log('logout', req.user);
	req.logout((err) => {
		if (err) { return next(err); }
    req.session.destroy();
	});
	res.redirect('/login');
});

const home =  async (req, res, next) => {
	//console.log('term', req.params.term, req.session.term);
	const countFy = await models.FiscalYear.count();
	if ( countFy === 0 ){
	  res.redirect('/setup');
	}else{
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
		  res.render('home.spy', {
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
  }
};

const setup  =  async (req, res, next) => {
  const countFy = await models.FiscalYear.count();
  if ( countFy === 0 ){
    res.render('setup.spy', {
      title: 'Setup'
    });
  }else{
    res.redirect('/home');
  }
};
router.get('/', is_authenticated, home);
router.get('/setup', is_authenticated, setup);
router.get('/home/:term', is_authenticated, home);
router.get('/home', is_authenticated, home);
router.get('/login', (req, res, next) => {
	res.render('index.spy', {
		title: '',
		msg_type: '',
		message: ''
	});
});
router.get('/signup', (req, res, next) => {
	res.render('index.spy', {
		title: '',
		msg_type: '',
		message: ''
	});
});

export default router;
