const models = require('../models');
const Op = models.Sequelize.Op;
const {User, is_authenticated} = require('../libs/user');

module.exports = {
    list: (req, res, next) => {
        models.User.findAll().then((users) => {
                res.json(users);
        });
    },
    get: (req, res, next) => {
        let id = req.params.id;
        if  ( id )  {

        } else {
            models.User.findOne({
                where: {
                    name: req.session.user.name
                }
            }).then((user) => {
                res.json(user);
            });
        }

    },
    post: (req, res, next) => {

    },
}