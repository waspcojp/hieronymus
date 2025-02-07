import models from '../models/index.js';
const Op = models.Sequelize.Op;

export default {
  get: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let id =  req.params.id;
    console.log('/api/task/', id);
    let include = [
      {
        model: models.Customer,
        as: 'customer'
      },
      {
        model: models.TaskDetail,
        as: 'lines'
      },
      {
        model: models.User,
        as: 'handleUser',
        attributes: ['name'],
        include: [
          {
            model: models.Member,
            as: 'member',
            attributes: ['legalName', 'tradingName']
          }
        ]
      },
      {
        model: models.Document,
        as: 'document'
      }
    ];
    
    if	( !id )	{
      let	order;
      let where;
      console.log('query', req.query);
      if	( req.query.order )	{
        order = req.params.order;
      } else {
        order = [
          [ "issueDate", "DESC" ],
          [ "customerId", "ASC"]
        ]
      }
      if	( req.query.customer )	{
        where = {
          customerId: parseInt(req.query.customer)
        };
      }
      //console.log({where});
      //console.log({order});
      //console.log({include});
      models.Task.findAll({
        where: where,
        order: order,
        include: include
      }).then((task) => {
        res.json(task);
      });
    } else {
      models.Task.findByPk(id, {
        include: include,
        order: [
          [ "lines", "lineNo", "ASC"]
        ]
      }).then((task) => {
        res.json({
          task: task
        });
      });
    }
  },
  post: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    if  ( req.session.user.customerManagement )    {
      let body = req.body;
      body.createdBy = req.session.user.id;
      body.updatedBy = req.session.user.id;
      body.id = undefined;
      console.log('body', JSON.stringify(body, ' ', 2 ));
      let document = await models.Document.create({
        issueDate: body.issueDate,
        title: body.subject,
        descriptionType: body.document.descriptionType,
        description: body.document.description,
        handledBy: body.handledBy,
        createdBy: body.createdBy,
        updatedBy: body.updatedBy
      });
      body.documentId = document.id;
      models.Task.create(body).then(async (task)=> {
        let lines = [];
        for ( let i = 0 ; i < body.lines.length ; i ++ )  {
          let line = body.lines[i];
          if	(( typeof line.itemId === 'number ') ||
        			 ( line.itemName !== '' ))	{
          	line.taskId = task.id;
          	line.lineNo = i;
          	line.id = undefined;
          	line = await models.TaskDetail.create(line);
          	lines.push(line.dataValues);
          }
        }
        console.log(lines);
        let _task = task.dataValues;
        _task.document = document.dataValues;
        _task.lines = lines;
        //console.log('task', JSON.stringify(task, ' ', 2 ));
        res.json({
          task: _task
        });
      }).catch ((e) => {
        console.log(e);
        res.json({ code: -1 });
      });
    } else {
      res.json({ code: -2 });
    }
  },
  update: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
		let body = req.body;
		body.updatedBy = req.session.user.id;
		let id = req.params.id ? parseInt(req.params.id) : body.id;
    if  ( req.session.user.customerManagement )    {
      models.Task.findByPk(id, {
        include: [
          {
            model: models.Document,
            as: 'document'
          }
        ]
      }).then(async (task) => {
        task.set(body);
        await task.save();
        await models.TaskDetail.destroy({
          where: {
            taskId: task.id
          }
        });
        let lines = [];
        for ( let i = 0 ; i < body.lines.length ; i ++ )  {
          let line = body.lines[i];
          if	(( typeof line.itemId === 'number ') ||
        			 ( line.itemName !== '' ))	{
          	line.taskId = task.id;
          	line.lineNo = i;
          	line.id = undefined;
          	let _line = await models.TaskDetail.create(line);
          	lines.push(_line.dataValues);
          }
        };
        console.log({lines});
        task.document.issueDate = body.issueDate;
        task.document.title = body.subject;
        task.document.descriptionType = body.document.descriptionType;
        task.document.description = body.document.description;
        task.document.handledBy = body.handledBy;
        task.document.createdBy = body.createdBy;
        task.document.updatedBy = body.updatedBy;
        await task.document.save();
        task.dataValues.lines = lines;
        console.log(JSON.stringify(task, ' ', 2 ));
        res.json({
          task: task
        });
      }).catch ((e) => {
        console.log(e);
        res.json({ code: -1 });
      });
    } else {
      res.json({ code: -2 });
    }
  },
  delete: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let id = parseInt(req.params.id);
    if  ( req.session.user.customerManagement )   {
      await models.Task.destroy({
        where: {
          id: id
        }
      });
      res.json({ code: 0});
    } else {
      res.json({ code: -2});
    }
  }
}