import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';
import models from '../models/index.js';
const Op = models.Sequelize.Op;

const home =  async (req, res, next) => {
  if ( req.session.user.accounting )	{
    res.render('voucher.spy', {
            title: 'Voucher',
            msg_type: '',
            message: '',
            term: req.session.term,
            user: req.session.user.name
          });
  } else {
    res.redirect('/home');
  }
}

const file = (req, res, next) => {
  console.log('/voucher/file', req.params.id);
  if ( req.session.user.accounting )	{
    models.VoucherFile.findOne({
      where: {
        id: req.params.id
      }
    }).then((content) => {
      res.set('Content-Type', content.mimeType);
      res.send(content.body);
    })
  } else {
    res.redirect('/home');
  }
}

router.get('/', is_authenticated, home);
router.get('/file/:id', is_authenticated, file)
router.get('/:term', is_authenticated, home);
router.get('/:term/:command', is_authenticated, home);
router.get('/:term/:command/:id', is_authenticated, home);

export default router;
