const express = require('express');
const router = express.Router();
const {is_authenticated, User} = require('../libs/user');
const models = require('../models');
const Op = models.Sequelize.Op;

const home =  async (req, res, next) => {
	if ( req.session.user.customer_management )	{
		res.render('customer', {
						title: 'Customer',
						msg_type: '',
						message: '',
						term: req.session.term,
						user: req.session.user.name
					});
	} else {
		res.redirect('/home');
	}
}

router.get('/', is_authenticated, home);
router.get('/:no', is_authenticated, home);

module.exports = router;
