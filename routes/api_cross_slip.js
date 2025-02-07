import models from '../models/index.js';
const Op = models.Sequelize.Op;
import {create as createCrossSlip, update as updateCrossSlip} from '../libs/cross_slip.js';

export default {
  list: async(req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    switch  ( req.params.type)  {
      case  'not_approved':
        let where;
        if  ( req.session.user.approvable ) {
          where = {
            approvedAt: {
              [Op.eq]: null
            },
            term: req.session.term
          }
        } else {
          where = {
            approvedAt: {
              [Op.eq]: null
            },
            term: req.session.term,
            createdBy: req.session.user.id
          }
        }
        let cross_slips = await models.CrossSlip.findAll({
          where: where,
          include: [{
            model: models.User,
            as: 'creater'
          }, {
            model: models.User,
            as: 'approver'
          }, {
            model: models.User,
            as: 'updater'
          }
        ],
        order: [
          [ 'year', 'ASC'],
          [ 'month', 'ASC'],
          [ 'day', 'ASC' ],
          [ 'no', 'ASC' ]
        ]
          });
        res.json(cross_slips);
        break;
      default:
        break;
    }
  },
  get: async(req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let year = req.params.year;
    let month = req.params.month;
    let no = req.params.no;

    let cross_slip = await models.CrossSlip.findOne({
      where: {
        [Op.and]: {
          year: year,
          month: month,
          no: no
        }
      },
      include: [
        {
          model: models.CrossSlipDetail,
          as: 'lines'
        },
        {
          model: models.User,
          as: 'creater'
        },
        {
          model: models.User,
          as: 'approver'
        }
      ]
    });
    //console.log(cross_slip);
    res.json(cross_slip);
  },
  post: async(req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    if	( req.session.user.accounting )  {
      let body = req.body;
      //console.log('body:', body);
      let slip = await createCrossSlip(body, req.session.user);
   
      res.json(slip);
    } else {
      res.json({
        code: -10,
        message: 'this account can not create'
      });
    }
  },
  update: async(req, res, next) => {
    let body = req.body;
    let slip = await models.CrossSlip.findOne({
        where: {
          year: body.year,
          month: body.month,
          no: body.no
        }
      });
    if ( slip ) {
      if	( !slip.approvedAt )	{
        if	(( req.session.user.accounting ) ||
           ( req.session.user.id == slip.createdBy )) {
            await updateCrossSlip(slip, body, req.session.user);
            res.json({
              code: 0
            });
        } else {
        }
      } else {
        res.json({
          code: -2,
          message: 'this slip was approved'
        });
      }
    } else {
      res.json({
        code: -1,
        message: 'record not found'
      });
    }
  },
  delete: async(req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    if	( req.session.user.approvable )	{
      let body = req.body;
      //console.log('body:', body);
      let slip = await models.CrossSlip.findOne({
        where: {
          year: body.year,
          month: body.month,
          day: body.day,
          no: body.no
        }
      });
      if	( !slip.approvedAt )	{
        await slip.destroy();
        res.json({
          code: 0,
        });
      } else {
        res.json({
          code: -2,
          message: 'thid slip was approved'
        });
      }
    } else {
      res.json({
        code: -10,
        message: 'this account can not delete'
      });
    }
  },
  approve: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    if	( req.session.user.approvable )	{
      let body = req.body;
      //console.log('update body:', body);
      models.CrossSlip.findOne({
        where: {
          year: body.year,
          month: body.month,
          no: body.no
        }
      }).then((slip) => {
        slip.approvedAt = body.approvedAt;
        if	( body.approvedAt )	{
          slip.approvedBy = req.session.user.id;
        } else {
          slip.approvedBy = null;
        }
        slip.updatedBy = req.session.user.id;
        slip.save();
        res.json({
          code: 0,
          id: slip.id
        });
      }).catch((e) => {
        res.json({
          code: -1,
          message: 'record not found'
        });
      });
    } else {
      res.json({
        code: -10,
        message: 'this account can not approve'
      });
    }
  }
}
