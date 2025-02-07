import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';
import models from '../models/index.js';
const Op = models.Sequelize.Op;
import company from '../config/company.js';

const screen = (req, res, next) => {
    console.log('command', req.params.command);
    if ( req.session.user.customerManagement )	{
      switch  (req.params.command)  {
        case  'entry':
        case  'new':
          break;
        default:
          break;
      }
      res.render('index.spy', {
        term: req.session.term,
        user: req.session.user.name
      });
    } else {
      res.redirect('/home');
    }
}

router.use('/:command', is_authenticated, screen);
router.use('/:command/:id', is_authenticated, screen);
router.use('/', is_authenticated, screen);

export default router;