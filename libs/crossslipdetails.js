const models = require('../models');
const Op = models.Sequelize.Op;

module.exports = class {
    static  async   all(fy, accountCode, subAccountCode) {
        //console.log(fy);
        let details = []
        for ( let mon = new Date(fy.startDate); mon < new Date(fy.endDate); ) {
            //console.log(mon);
            if  ( subAccountCode )  {
                details = details.concat( await models.CrossSlipDetail.findAll({
                    where: {
                        [Op.and]: {
                            [Op.or]: [
                                {
                                    debitAccount: accountCode,
                                    debitSubAccount: subAccountCode
                                },
                                {
                                    creditAccount: accountCode,
                                    creditSubAccount: subAccountCode
                                }
                            ],
                            '$CrossSlip.year$': mon.getFullYear(),
                            '$CrossSlip.month$': mon.getMonth() + 1
                        },
                    },
                    include: [{
                        model: models.CrossSlip,
                        as: 'CrossSlip'
                    }],
                    order: [
                        models.sequelize.literal('"CrossSlip"."year", "CrossSlip"."month", "CrossSlip"."day", "CrossSlip"."no", "CrossSlipDetail"."lineNo" ASC')
                    ]
                }));
            } else {
                details = details.concat( await models.CrossSlipDetail.findAll({
                    where: {
                        [Op.and]: {
                            '$CrossSlip.year$': mon.getFullYear(),
                            '$CrossSlip.month$': mon.getMonth() + 1,
                            [Op.or]: {
                                debitAccount: accountCode,
                                creditAccount: accountCode
                            }
                        }
                    },
                    include: [{
                        model: models.CrossSlip,
                        as: 'CrossSlip'
                    }],
                    order: [
                        models.sequelize.literal('"CrossSlip"."year", "CrossSlip"."month", "CrossSlip"."day", "CrossSlip"."no", "CrossSlipDetail"."lineNo" ASC')
                    ]
                }));
            }
			mon.setMonth(mon.getMonth() + 1);
        }
        return  (details);
    }
}