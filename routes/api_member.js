import models from '../models/index.js';
const Op = models.Sequelize.Op;

export default {
  get: async (req, res, next) => {
    let id =  req.params.id;
    //console.log('/api/member/', id);
    let include = [
      {
        model: models.MemberClass,
        as: 'memberClass'
      },
      {
        model: models.User,
        as: 'user'
      }
    ];
    if	( !id )	{
      let query = {
        order: [
          ['legalName', 'ASC']
        ],
        include: include
      };
      console.log('query', req.query);
      if  ( req.query.memberClassId ) {
        if  ( query.where ) {
          query.where.memberClassId = parseInt(req.query.memberClassId);
        } else {
          query.where = {
            memberClassId: parseInt(req.query.memberClassId)
          }
        }
      }
      console.log(JSON.stringify(query, ' ', 2));
      models.Member.findAll(query).then( async(members) => {
        res.json(members);
      });
    } else {
      models.Member.findByPk(id, {
        include: include
      }).then((member) => {
        res.json(member);
      });
    }
  },
  post: (req, res, next) => {
    let body = req.body;
    models.Member.create(body).then((member) => {
      //console.log(member);
      res.json(member);
    });
  },
  update: async(req, res, next) => {
    let body = req.body;
    let id = req.params.id ? req.params.id : body.id;

    let member = await models.Member.findByPk(id)
    if	( member )	{
      member.set(body);
      member.save().then(() => {
        res.json(member);
      });
    }
  },
  delete: async(req, res, next) => {
    let body = req.body;
    let id = req.params.id ? req.params.id : body.id;

    let member = await models.Member.findByPk(id);
    if	( member )	{
      member.destroy().then(() => {
        res.json({
          code: 0});
      });
    }
  },
  classes: (req, res, next) => {
    models.MemberClass.findAll().then((result) => {
      res.json(result)
    }).catch((e) => {
      res.json({
        code: -1
      });
    })
  }
};
