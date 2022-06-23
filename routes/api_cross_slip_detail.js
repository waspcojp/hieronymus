const models = require('../models');
const Op = models.Sequelize.Op;

module.exports = {
	get: (req, res, next) => {
        let id = req.params.id;

        models.CrossSlipDetail.findOne({
            where: {
                id: id
            }
        }).then((detail) => {
            res.json(detail);
        });
    },
    update: (req, res, next) => {
        let detail = req.body;
        console.log('update', detail);
        models.CrossSlipDetail.findOne({
            where: {
                id: detail.id
            }
        }).then((result) => {
            if ( result ) {
                result.set(detail);
                result.save().then(() => {
                    res.json(result);
                });
            }
        });
    }
}
