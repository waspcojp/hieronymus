import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';
import models from '../models/index.js';
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

export default router;
