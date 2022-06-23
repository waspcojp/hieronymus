const express = require('express');
const router = express.Router();
const {is_authenticated, User} = require('../libs/user');
const models = require('../models');
const Op = models.Sequelize.Op;

const home =  async (req, res, next) => {
	res.render('customer', {
						title: 'Customer',
						msg_type: '',
						message: '',
						term: req.session.term,
						user: User.current(req)
					});
};

router.get('/', is_authenticated, home);
router.get('/:no', is_authenticated, home);

module.exports = router;
