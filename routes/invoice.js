import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';
import models from '../models/index.js';
const Op = models.Sequelize.Op;
import company from '../config/company.js';

const screen = (req, res, next) => {
    console.log('command', req.params.command);
    let term;
    if	( req.params.term )	{
      term = parseInt(req.params.term);
    } else {
      term = req.session.term;
    }
    if ( req.session.user.accounting )	{
      res.render('index.spy', {
        term: term,
        user: req.session.user.name
      });
    } else {
      res.redirect('/home');
    }
}

const form_invoice = async (req, res, next) => {
  if  ( req.session.user.accounting ) {
    let id = req.params.id;
    let invoice = await models.Invoice.findByPk(id, {
      include: [{
          model: models.Customer,
          as: 'customer'
        },
        {
          model: models.InvoiceDetail,
          as: 'lines'
        },
        {
          model: models.User,
          as: 'handleUser',
        }
      ]
    });
    res.render('form/invoice.ejs', {
      invoice: invoice,
      company: company
    });
  } else {
    res.redirect('/home');
  }
}

router.get('/invoice/:id', is_authenticated, form_invoice);
router.use('/:term/:command', is_authenticated, screen);
router.use('/:term/:command/:id', is_authenticated, screen);
router.use('/:term', is_authenticated, screen);
router.use('/', is_authenticated, screen);

export default router;