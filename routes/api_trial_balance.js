import trial_balance from '../libs/trial_balance.js';

export default {
	get: (req, res, next) => {
		let term = parseInt(req.params.term);

		trial_balance(term).then((ret) => {
			res.json(ret.lines);
		})
	},
}
