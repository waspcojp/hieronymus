import models from '../models/index.js';
import fs from 'fs';
const Op = models.Sequelize.Op;
import Mime from 'mime';

const getFiles = async (id) => {
  let files = await models.DocumentFile.findAll({
    where: {
      documentId: id
    },
    attributes: {
      exclude: ['body']
    }
  });
  for	( let i = 0 ; i < files.length; i += 1 )	{
    if	( files[i].mimeType.match(/^image\//) )	{
      let file = await models.DocumentFile.findOne({
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
    //console.log('/api/document/', id);
    if	( !id )	{
      let query = {
        order: [
          ['issueDate', 'DESC']
        ]
      };
      console.log('query', req.query);
      query.include.push({
        model: models.DocumentFile,
        as: 'files',
        attributes: [ 'id', 'mimeType']
      });
      console.log(JSON.stringify(query, ' ', 2));
      models.Document.findAll(query).then((documents) => {
        res.json(documents);
      });
    } else {
      models.Document.findByPk(id).then((document) => {
        res.json(document);
      });
    }
  },
  post: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let body = req.body;
    models.Document.create(body).then((document) => {
      //console.log(document);
      res.json(document);
    });
  },
  update: async(req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let body = req.body;
    let id = req.params.id ? req.params.id : body.id;

    let document = await models.Document.findByPk(id)
    if	( document )	{
      document.set(body);
      document.save().then(() => {
        res.json(document);
      });
    }
  },
  delete: async(req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let body = req.body;
    let id = req.params.id ? req.params.id : body.id;

    let document = await models.Document.findByPk(id);
    if	( document )	{
      document.destroy().then(() => {
        res.json({
          code: 0});
      });
    }
  },
  upload: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let document_id = req.params.id ? parseInt(req.params.id) : null;
    let name = req.files.file.name;
    let tmp_name = req.files.file.path;
    let body = fs.readFileSync(tmp_name);
    let	mime_type = Mime.getType(tmp_name);
    models.DocumentFile.create({
      name: name,
      documentId: document_id,
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
    console.log('/api/document/files', id);
    if	( id )	{
      let files = await getFiles(id);
      res.json(files);
    }
  },
  file: (req, res, next) => {
    console.log('/api/document/file/', req.params.id);
    if ( req.session.user.accounting )	{
      models.DocumentFile.findOne({
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
  },
  bind: (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    let	body = req.body;
    models.DocumentFile.findByPk(body.id).then((file) => {
      file.documentId = body.documentId;
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
    models.DocumentFile.findByPk(id).then((file) => {
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
  }
};
