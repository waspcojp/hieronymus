import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';
import models from '../models/index.js';
const Op = models.Sequelize.Op;
import company from '../config/company.js';

const screen = (req, res, next) => {
    console.log('command', req.params.command);
    if ( req.session.user.accounting )	{
      res.render('index.spy', {
        term: req.session.term,
        user: req.session.user.name
      });
    } else {
      res.redirect('/home');
    }
}

const form_out = async (req, res, form) => {
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
        include: [
          {
            model: models.Member,
            as: 'member'
          }
        ]
      }
    ]
  });
  res.render(`form/${form}.ejs`, {
    invoice: invoice,
    company: company
  });
}

const form_invoice = async (req, res, next) => {
  if  ( req.session.user.accounting ) {
    await form_out(req, res, 'invoice');
  } else {
    res.redirect('/home');
  }
}
const form_estimate = async (req, res, next) => {
  if  ( req.session.user.accounting ) {
    await form_out(req, res, 'estimate');
  } else {
    res.redirect('/home');
  }
}

router.get('/invoice/:id', is_authenticated, form_invoice);
router.get('/estimate/:id', is_authenticated, form_estimate);
router.use('/:command', is_authenticated, screen);
router.use('/:command/:id', is_authenticated, screen);
router.use('/', is_authenticated, screen);

export default router;