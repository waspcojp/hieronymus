import models from '../models/index.js';
const Op = models.Sequelize.Op;

export const create = async (body, user) => {
  let fy = await models.FiscalYear.findOne({
    where: {
      startDate: {
        [Op.lte]: new Date(body.year, body.month - 1, 2)
      },
      endDate: {
        [Op.gte]: new Date(body.year, body.month - 1, 2)
      }
    }
  });
  //console.log('fy', fy);
  let ml = await models.MonthlyLog.findOne({
    where: {
      term: fy.term,
      month: body.month
    }
  });
  if	( !ml )	{
    ml = await models.MonthlyLog.create({
      term: fy.term,
          month: body.month,
          slipCount: 0,
          voucharCount: 0
    })
  }
  //console.log('ml', ml);
  ml.slipCount += 1;
  
  let approvedAt;
  let approvedBy;
  if	( user.approvable )	{
    approvedAt = new Date();
    approvedBy = user.id;
  }
  let slip = await models.CrossSlip.create({
    year: body.year,
    month: body.month,
    day: body.day,
    no: ml.slipCount,
    lineCount: body.lines.length,
    createdBy: user.id,
    approvedAt: approvedAt,
    approvedBy: approvedBy,
    term: body.term
  });
  ml.save();
  
  let lines = [];
  for ( let i = 0; i < body.lines.length ; i ++ ) {
    let line = body.lines[i];
    line.crossSlipId = slip.id;
    line.lineNo = i;
    //console.log(line);
    await models.CrossSlipDetail.create(line);
    lines.push(line);
  }
  return  ({
    year: body.year,
    month: body.month,
    day: body.day,
    no: slip.no,
    lines: lines
  })
}

export const update = async (slip, body, user) => {
  slip.lineCount = body.lines.length;
  slip.day = body.day;
  slip.updatedBy = user.id;
  if	( user.approvable )	{
    slip.approvedAt = new Date();
    slip.approvedBy = user.id;
  }
  slip.save();
  await models.CrossSlipDetail.destroy({
    where: {
      crossSlipId: slip.id
    }
  });
  for ( let i = 0; i < body.lines.length ; i ++ ) {
    let line = body.lines[i];
    line.crossSlipId = slip.id;
    line.lineNo = i;
    //console.log(line);
    await models.CrossSlipDetail.create(line);
  }
}