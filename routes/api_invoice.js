import models from '../models/index.js';
const Op = models.Sequelize.Op;
import company from '../config/company.js';

export default {
  get: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let id =  req.params.id;
    console.log('/api/invoice/', id);
    let include = [
      {
        model: models.Customer,
        as: 'customer'
      },
      {
        model: models.InvoiceDetail,
        as: 'lines'
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
          [ "issueDate", "ASC" ]
        ]
      }
      where = {
        term: parseInt(req.query.term)
      };
      if	( req.query.customer )	{
        where = {
          [Op.and]: [
            where,
            {
              customerId: parseInt(req.query.customer)
            }
          ]
        };
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
        include: include
      }).then((invoice) => {
        res.json(invoice);
      });
    }
  },
  post: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    if  ( req.session.user.customerManagement )    {
      let body = req.body;
      body.createdBy = req.session.user.id;
      body.updatedBy = req.session.user.id;
      body.term = req.session.term;
      let fy = await models.FiscalYear.findOne({
        where: {
          term: req.session.term
        }
      });
      fy.invoiceCount += 1;
      fy.save();
      body.no = `${fy.year}-${fy.invoiceCount}`;
      body.id = undefined;
      console.log(JSON.stringify(body, ' ', 2 ));
      models.Invoice.create(body).then(async (invoice)=> {
        let lines = [];
        for ( let i = 0 ; i < body.lines.length ; i ++ )  {
          let line = body.lines[i];
          line.invoiceId = invoice.id;
          line.lineNo = i;
          line.id = undefined;
          line = await models.InvoiceDetail.create(line);
          lines.push(line.dataValues);
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
      models.Invoice.findByPk(id).then(async (invoice) => {
        invoice.set(body);
        await invoice.save();
        await models.InvoiceDetail.destroy({
          where: {
            invoiceId: invoice.id
          }
        });
        let lines = [];
        for ( let i = 0 ; i < body.lines.length ; i ++ )  {
          let line = body.lines[i];
          line.invoiceId = invoice.id;
          line.lineNo = i;
          line.id = undefined;
          let _line = await models.InvoiceDetail.create(line);
          lines.push(_line.dataValues);
        };
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
  }
}