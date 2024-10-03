import models from '../models/index.js';
const Op = models.Sequelize.Op;

export default class {
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
                            '$crossSlip.year$': mon.getFullYear(),
                            '$crossSlip.month$': mon.getMonth() + 1
                        },
                    },
                    include: [{
                        model: models.CrossSlip,
                        as: 'crossSlip'
                    }],
                    order: [
                        models.sequelize.literal('"crossSlip"."year", "crossSlip"."month", "crossSlip"."day", "crossSlip"."no", "CrossSlipDetail"."lineNo" ASC')
                    ]
                }));
            } else {
                details = details.concat( await models.CrossSlipDetail.findAll({
                    where: {
                        [Op.and]: {
                            '$crossSlip.year$': mon.getFullYear(),
                            '$crossSlip.month$': mon.getMonth() + 1,
                            [Op.or]: {
                                debitAccount: accountCode,
                                creditAccount: accountCode
                            }
                        }
                    },
                    include: [{
                        model: models.CrossSlip,
                        as: 'crossSlip'
                    }],
                    order: [
                        models.sequelize.literal('"crossSlip"."year", "crossSlip"."month", "crossSlip"."day", "crossSlip"."no", "CrossSlipDetail"."lineNo" ASC')
                    ]
                }));
            }
			mon.setMonth(mon.getMonth() + 1);
        }
        return  (details);
    }
}