import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';

const member = (req, res, next) => {
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

router.use('/:command', is_authenticated, member);
router.use('/:command/:id', is_authenticated, member);
router.use('/', is_authenticated, member);

export default router;