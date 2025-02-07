import models from '../models/index.js';
const Op = models.Sequelize.Op;
import company from '../config/company.js';

export default {
  get: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log(models.Invoice.associations);
    let id =  req.params.id;
    console.log('/api/invoice/', id);
    let include = [
      {
        model: models.Task,
        as: 'task'
      },
      {
        model: models.InvoiceDetail,
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
      if  ( !req.query )  {
        res.json({
          no: company.invoiceNo,
          issueDate: new Date(),
        })
      } else
      if	( req.query.order )	{
        order = req.params.order;
      } else {
        order = [
          [ "issueDate", "DESC" ],
          [ "lines", "lineNo", "ASC"]
        ]
      }
      if	( req.query.customer )	{
        include.push(
          {
            model: models.Task,
            as: 'task',
            where: {
              customerId: parseInt(req.query.customer)
            }
          })
      } else {
        include.push(
          {
            model: models.Task,
            as: 'task'
          });
      }
      if	( req.query.kind )	{
        let kind = parseInt(req.query.kind);
        if  ( kind > 0 )  {
          if  ( where ) {
            where = {
              [Op.and]: [
                where,
                {
                  kind: parseInt(req.query.kind)
                }
              ]
            };
          } else {
            where = {
              kind: parseInt(req.query.kind)
            };
          }
        }
      }
      //console.log({where});
      //console.log({order});
      //console.log({include});
      models.Invoice.findAll({
        where: where,
        order: order,
        include: include
      }).then((invoice) => {
        res.json(invoice);
      });
    } else {
      models.Invoice.findByPk(id, {
        include: include,
        order: [
          [ "lines", "lineNo", "ASC"]
        ]
      }).then((invoice) => {
        res.json({
          invoice: invoice
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
      if  ( !body.no )  {
        let fy = await models.FiscalYear.findOne({
          where: {
            term: req.session.term
          }
        });
        fy.invoiceCount += 1;
        fy.save();
        body.no = `${fy.year}-${fy.invoiceCount}`;
      }
      body.id = undefined;
      console.log(JSON.stringify(body, ' ', 2 ));
      if	( body.document.descriptionType )	{
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
      }
      models.Invoice.create(body).then(async (invoice)=> {
        let lines = [];
        for ( let i = 0 ; i < body.lines.length ; i ++ )  {
          let line = body.lines[i];
          if	(( typeof line.itemId === 'number ') ||
        			 ( line.itemName !== '' ))	{
          	line.invoiceId = invoice.id;
          	line.lineNo = i;
          	line.id = undefined;
          	line = await models.InvoiceDetail.create(line);
          	lines.push(line.dataValues);
          }
        }
        console.log(lines);
        let _invoice = invoice.dataValues;
        _invoice.lines = lines;
        console.log(JSON.stringify(_invoice, ' ', 2 ));
        res.json(_invoice);
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
      models.Invoice.findByPk(id, {
              include: [
                {
                  model: models.Document,
                  as: 'document'
                }
              ]
      }).then(async (invoice) => {
        let kind = invoice.kind;
        let documentId = invoice.documentId;
        invoice.set(body);
        if	( kind < 10 )	{
        	await models.InvoiceDetail.destroy({
          	where: {
            	invoiceId: invoice.id
          	}
        	});
        } else {
          if	(( !body.document.descriptionType ) &&
          		 ( invoice.documentId ) )	{
          	await models.Document.destroy({
            	where: {
              	id: invoice.documentId
            	}
          	})
            invoice.documentId = null;
          }
        }
        let lines = [];
        let _invoice = invoice.dataValues;
        for ( let i = 0 ; i < body.lines.length ; i ++ )  {
          let line = body.lines[i];
          if	(( typeof line.itemId === 'number') ||
            	 ( line.itemName !== '' ))	{
         		line.invoiceId = invoice.id;
          	line.lineNo = i;
          	line.id = undefined;
          	let _line = await models.InvoiceDetail.create(line);
          	lines.push(_line.dataValues);
          }
        }
        if	(( body.document ) &&
        		 ( body.document.descriptionType ))	{
          if	( documentId )	{
            _invoice.document.issueDate = body.issueDate;
          	_invoice.document.title = body.subject;
          	_invoice.document.descriptionType = body.document.descriptionType;
          	_invoice.document.description = body.document.description;
          	_invoice.document.handledBy = body.handledBy;
          	_invoice.document.createdBy = body.createdBy;
          	_invoice.document.updatedBy = body.updatedBy;
            await _invoice.document.save();
          } else {
            let document = await models.Document.create({
	            issueDate: body.issueDate,
  	          title: body.subject,
    	        descriptionType: body.document.descriptionType,
      	      description: body.document.description,
      	      handledBy: body.handledBy,
        	    createdBy: body.createdBy,
          	  updatedBy: body.updatedBy
          	});
            invoice.documentId = document.id;
          }
        }
        await invoice.save();
        _invoice.lines = lines;
        console.log(JSON.stringify(_invoice, ' ', 2 ));
        res.json(_invoice);
      }).catch ((e) => {
        console.log(e);
        res.json({ code: -1 });
      });
    } else {
      res.json({ code: -2 });
    }
  },
  delete: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let id = parseInt(req.params.id);
    if  ( req.session.user.customerManagement )   {
      models.Invoice.findByPk(id).then((invoice) => {
        invoice.destroy().then(() => {
          res.json({ code: 0});
        }).catch (()=> {
          res.json({ code: -1});
        })
      })
    } else {
      res.json({ code: -2});
    }
  },
  allocateReceivable: (req, res, next) => {

  },
  
}