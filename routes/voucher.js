const express = require('express');
const router = express.Router();
const {is_authenticated, User} = require('../libs/user');
const models = require('../models');
const Op = models.Sequelize.Op;

const home =  async (req, res, next) => {
	res.render('voucher', {
						title: 'Voucher',
						msg_type: '',
						message: '',
						term: req.session.term,
						user: req.session.user.name
					});
};

const file = (req, res, next) => {
	console.log('/voucher/file', req.params.id);
	models.VoucherFile.findOne({
		where: {
			id: req.params.id
		}
	}).then((content) => {
		res.set('Content-Type', content.mimeType);
		res.send(content.body);
	})
};

router.get('/', is_authenticated, home);
router.get('/file/:id', is_authenticated, file)
router.get('/:term', is_authenticated, home);

module.exports = router;
