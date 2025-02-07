import models from '../models/index.js';
import fs from 'fs';
const Op = models.Sequelize.Op;
import Mime from 'mime';

const getFiles = async (id) => {
  let files = await models.ItemFile.findAll({
    where: {
      itemId: id
    },
    attributes: {
      exclude: ['body']
    }
  });
  for	( let i = 0 ; i < files.length; i += 1 )	{
    if	( files[i].mimeType.match(/^image\//) )	{
      let file = await models.ItemFile.findOne({
          where: {
            id: files[i].id
          },
          attributes: {
            include: ['body']
          }
        });
      files[i].body = file.body.toString('base64');
    } else {
      files[i].body = '';
    }
  }
  return	(files);
}

export default {
  get: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let id =  req.params.id;
    //console.log('/api/item/', id);
    if	( !id )	{
      let query = {
        order: [
          ['name', 'ASC']
        ]
      };
      console.log('query', req.query);
      if  ( !req.query.product ) {
        query.include = [
          {
            model: models.ItemClass,
            as: 'itemClass'
          }
        ];
      } else {
        query.include = [
          {
            model: models.ItemClass,
            as: 'itemClass',
            where: {
              product: ( req.query.product === 'true' ) ? true : false
            }
          }
        ];
      }
      query.include.push({
        model: models.ItemFile,
        as: 'files',
        attributes: [ 'id', 'mimeType']
      });
      if	( req.query.key )	{
        query.where = {
          key: {
            [Op.like]: `%${req.query.key}%`
          }
        };
      }
      if  ( req.query.itemClassId ) {
        if  ( query.where ) {
          query.where.itemClassId = parseInt(req.query.itemClassId);
        } else {
          query.where = {
            itemClassId: parseInt(req.query.itemClassId)
          }
        }
      }
      console.log(JSON.stringify(query, ' ', 2));
      models.Item.findAll(query).then( async(items) => {
        res.json(items);
      });
    } else {
      models.Item.findByPk(id).then((item) => {
        res.json(item);
      });
    }
  },
  post: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let body = req.body;
    models.Item.create(body).then((item) => {
      //console.log(item);
      res.json(item);
    });
  },
  update: async(req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let body = req.body;
    let id = req.params.id ? req.params.id : body.id;

    let item = await models.Item.findByPk(id)
    if	( item )	{
      item.set(body);
      item.save().then(() => {
        res.json(item);
      });
    }
  },
  delete: async(req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let body = req.body;
    let id = req.params.id ? req.params.id : body.id;

    let item = await models.Item.findByPk(id);
    if	( item )	{
      item.destroy().then(() => {
        res.json({
          code: 0});
      });
    }
  },
  upload: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let item_id = req.params.id ? parseInt(req.params.id) : null;
    let name = req.files.file.name;
    let tmp_name = req.files.file.path;
    let body = fs.readFileSync(tmp_name);
    let	mime_type = Mime.getType(tmp_name);
    models.ItemFile.create({
      name: name,
      itemId: item_id,
      mimeType: mime_type,
      body: body
    }).then	((ret) => {
      console.log(ret);
      ret.body = ret.body.toString('base64');
      res.json({
            code: 0,
            file: ret
          });
    }).catch((err) => {
      console.log(err);
      res.json({
            code: -1
          });
    });
  },
  files: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let id =  req.params.id ? parseInt(req.params.id): null;
    console.log('/api/item/files', id);
    if	( id )	{
      let files = await getFiles(id);
      res.json(files);
    }
  },
  bind: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let	body = req.body;
    models.ItemFile.findByPk(body.id).then((file) => {
      file.itemId = body.itemId;
      file.save().then(() => {
        res.json({
          code: 0
        });
      }).catch((e) => {
        console.log('error', e);
        res.json({
          code: -1
        });
      })
    })
  },
  deleteFile: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let id = parseInt(req.body.id);
    console.log('deleteFile', id);
    models.ItemFile.findByPk(id).then((file) => {
      file.destroy().then(() => {
        res.json({
          code: 0
        });
      }).catch((e) => {
        res.json({
          code: -1
        });
      });
    }).catch((e) => {
      res.json({
        code: -1
      })
    });
  },
  classes: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    models.ItemClass.findAll().then((result) => {
      res.json(result)
    }).catch((e) => {
      res.json({
        code: -1
      });
    })
  }
};
