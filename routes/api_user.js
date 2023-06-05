const models = require('../models');
const Op = models.Sequelize.Op;
const {passwd, is_authenticated} = require('../libs/user');

module.exports = {
    list: (req, res, next) => {
        models.User.findAll({
            order: [
                ["name", "ASC"]
            ]
        }).then((users) => {
             res.json(users);
        });
    },
    get: (req, res, next) => {
        let id = req.params.id;
        if  ( id )  {
            models.User.find(id).then((user) => {
                res.json(user);
            });
        } else {
            res.json(req.session.user);
        }

    },
    update: (req, res, next) => {
        let id = parseInt(req.params.id);
        if  (( req.session.user.id == id) ||
             ( req.session.user.administrable ))    {
            models.User.findByPk(id).then((user) => {
                if  ( req.body.administrable !== undefined )    {
                    if  ( user.id != 1 )    {
                        user.administrable = req.body.administrable;
                    }
                }
                if  ( req.body.accounting !== undefined )   {
                    user.accounting = req.body.accounting;
                }
                if  ( req.body.fiscal_browsing !== undefined )   {
                    user.fiscal_browsing = req.body.fiscal_browsing;
                }
                if  ( req.body.approvable !== undefined )   {
                    user.approvable = req.body.approvable;
                }
                if  ( req.body.inventory !== undefined )    {
                    user.inventory = req.body.inventory;
                }
                user.save().then(()=> {
                    res.json({ code: 0 });
                }).catch (() => {
                    res.json({ code: -1 });
                });
            })
        } else {
            res.json({ status: 'NG'});
        }
    },
    delete: (req, res, next) => {
        let id = parseInt(req.params.id);
        if  (( id != 1 ) &&
             ( req.session.user.administrable ))   {
            models.User.findByPk(id).then((user) => {
                user.destroy().then(() => {
                    res.json({ code: 0});
                }).catch (()=> {
                    res.json({ code: -1});
                })
            })
        } else {
            res.json({ code: -2});
        }
    },
    post: (req, res, next) => {

    },
    password: (req, res, next) => {
        let body = req.body;
        let user_name = req.session.user.name;
        passwd(user_name, body.currentPassword, body.newPassword).then((flag) => {
            res.json({
                result: flag ? 'OK' : 'NG'
            });
        })
    
    }
}