import express from 'express';
const router = express.Router();
import {is_authenticated} from '../libs/user.js';
import models from '../models/index.js';

const product = (req, res, next) => {
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

const file = (req, res, next) => {
  console.log('/item/file/', req.params.id);
  if ( req.session.user.accounting )	{
    models.ItemFile.findOne({
      where: {
        id: req.params.id
      }
    }).then((content) => {
      if  ( content ) {
        res.set('Content-Type', content.mimeType);
        res.send(content.body);
      } else {
        res.status(404);
        res.json({
          code: -1,
          message: 'not found'
      })
    }
    })
  } else {
    res.redirect('/home');
  }
}

router.get('/file/:id', is_authenticated, file)
router.use('/:command', is_authenticated, product);
router.use('/:command/:id', is_authenticated, product);
router.use('/', is_authenticated, product);

export default router;