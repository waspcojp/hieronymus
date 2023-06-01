const models = require('../models');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const passport = require('passport');
const Local = require('passport-local').Strategy;

passport.use(new Local({
		usernameField: 'user_name',
		passwordField: 'password',
		passReqToCallback: true,
		session: true,
	}, (req, user_name, password, done) => {
		//console.log('user_name', user_name);
		//console.log('password', password);
		//console.log('done', done);

		process.nextTick(() => {
			auth_user(user_name, password).then((user) => {
				//console.log('auth', user);
				return done(null, {
					user_name: user_name,
					user: user.dataValues
				});
			}).catch(() => {
				console.log('login error');
				return done(null, false, {
					message: 'fail'
				});
			});
		});
	})
)

passport.serializeUser((user, done) => {
	console.log('serialize:', user);
	done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log('deserialize:', user);
	done(null, user);
});

const	is_authenticated = (req, res, next) => {
	//console.log(req.session);

	if ( req.isAuthenticated() ) {
		return (next());
	} else {
		res.redirect('/login');
	}
}

const	auth_user = (name, password) => {
	return new Promise((done, fail) => {
		models.User.findOne({
			where: {
				name: name },
		}).then((user) => {
			//console.log(user);
			if ( user ) {
				if  ( bcrypt.compareSync(password, user.hash_password) ) {
					//console.log("auth ok");
					done(user);
				} else {
					//console.log("auth fail");
					fail(user);
				}
			} else {
				//console.log("user none");
				fail(null);
			}
		});
	});
}

module.exports = {
	is_authenticated: is_authenticated,
	auth_user: auth_user,
	passport: passport
};
