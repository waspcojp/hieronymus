import trial_balance from '../libs/trial_balance.js';

export default {
  get: (req, res, next) => {
    let term = parseInt(req.params.term);
    let lastDate;
    if	( req.params.lastdate )	{
      let ymd = req.params.lastdate.split('-');
      lastDate = new Date(parseInt(ymd[0]), parseInt(ymd[1]), 1);
    }

    trial_balance(term, lastDate).then((ret) => {
      res.json(ret.lines);
    })
  },
}
