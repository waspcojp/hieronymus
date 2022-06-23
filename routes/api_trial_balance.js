const trial_balance = require('../libs/trial_balance.js');


module.exports = {
	get: (req, res, next) => {
		let term = req.params.term;

		trial_balance(term).then((ret) => {
			res.json(ret.lines);
		})
	},
}
