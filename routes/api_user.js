import models from '../models/index.js';
const Op = models.Sequelize.Op;
import {passwd, passport, is_authenticated} from '../libs/user.js';

export default {
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
            console.log(req.session.user);
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
                if  ( req.body.inventory_management !== undefined )    {
                    user.inventory_management = req.body.inventory_management;
                }
                if  ( req.body.customer_management !== undefined )    {
                    user.customer_management = req.body.customer_management;
                }
                if  ( req.body.deauthorizedAt !== undefined )    {
                    user.deauthorizedAt = req.body.deauthorizedAt;
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
    
    },
    signup: (req, res, next) => {
        let user_name = req.body.user_name;
        let password = req.body.password;
        console.log('signup', user_name, password);
        models.User.check(user_name, password).then((_user) => {
            if  ( _user) {
                res.json({
                    result: 'NG',
                    message: `user ${user_name} duplicated`
                });
            } else {
                let user = new models.User({
                    name: user_name
                });
                user.password = password;
                models.User.count().then((count) => {
                    console.log('count', count);
                    if	( count === 0 )	{
                        user.administrable = true;
                        user.approvable = true;
                        user.inventory = true;
                    } else {
                        user.administrable = false;
                        user.approvable = false;
                        user.inventory = false;
                    }
                    //console.log('user--', user);
                    user.save().then((ret) => {
                        res.json({
                            result: 'OK'
                        })
                    });
                });
            }
        }).catch((err) => {
            res.json({
                result: 'NG',
                message: err
            });
        });
    },
    login:  (req, res, next) => {
        passport.authenticate('local', (error, user, info) => {
            //console.log('error', error);
            console.log('login user', user);
            //console.log('info', info);
            if (error) {
                return next(error);
            }
            if (( !user ) ||
                (( user.user.deauthorizedAt !== null ) &&
                 ( user.user.deauthorizedAt < new Date() )) ) {
                //console.log('user not found');
                res.json({
                    result: 'NG',
                    message: `user ${user.user_name} not found`
                });
            } else {
                req.login(user, (error, next) => {
                    console.log('/login user', user);
                    //console.log("error", error);
                    if (error) {
                        //console.log("error");
                        res.json({
                            result: 'NG',
                            message: `user ${user.user_name} not found`
                        });
                    } else {
                        req.session.user = user.user;
                        res.json({
                            result: 'OK'
                        });
                    }
                });
            }
        })(req, res, next);
    }
}