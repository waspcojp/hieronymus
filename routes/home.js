const express = require('express');
const router = express.Router();
const passport = require('passport');
const Local = require('passport-local').Strategy;
const {auth_user, is_authenticated, User} = require('../libs/user');
const models = require('../models');
const Op = models.Sequelize.Op;

passport.use(new Local(
	{
		usernameField: 'user_name',
		passwordField: 'password',
		passReqToCallback: true,
		session: true,
	}, (req, user_name, password, done) => {
		//console.log('user_name', user_name);
		//console.log('password', password);
		//console.log('done', done);

		process.nextTick(() => {
			auth_user(user_name, password).then(() => {
				return done(null, {
					user_name: user_name
				});
			}).catch(() => {
				console.log('login error');
				return done(null, false, {
					message: 'fail'
				});
			});
		});
	}));

passport.serializeUser((user, done) => {
	//console.log('serialize:', user);
	done(null, user);
});

passport.deserializeUser((user, done) => {
	//console.log('deserialize:', user);
	done(null, user);
});

/* GET users listing. */
router.get('/login', (req, res, next) => {
	res.render('login', { title: 'Login',
						  msg_type: '',
						  message: '',
						});
});

router.post('/login', (req, res, next) => {
	//console.log(req.body.user_name);
	//console.log(req.body.password);
  if ( req.body.user_name.length === 0 || req.body.password.length === 0 ){
    res.render('login', { title: 'Login',
                          msg_type: 'danger',
                          message: `ユーザー名またはパスワードが入力されていません。`
                        });
  }else{
    passport.authenticate('local', (error, user, info) => {
      console.log('error', error);
      //console.log('user', user);
      //console.log('info', info);
      if (error) {
        res.render('login', { title: 'Login',
                              msg_type: 'danger',
                              message: `エラーが発生しました。`
                            });
      }
      if ( !user ) {
        //console.log('user not found');
        res.render('login', { title: 'Login',
                    msg_type: 'danger',
                    message: `ユーザー名またはパスワードが違います。`
                  });
      } else {
        req.login(user, (error, next) => {
          //console.log('user', user);
          //console.log("error", error);
          if (error) {
            //console.log("error");
            res.render('login', { title: 'Login',
                        msg_type: 'danger',
                        message: `ユーザー名またはパスワードが違います。`
                      });
          } else {
            res.redirect('/home');
          }
        });
      }
    })(req, res, next);
  }
});

router.get('/logout', (req, res, next) => {
	//console.log('logout', req.user);
	req.session.destroy();
	req.logout();
	res.redirect('/login');
});

router.get('/signup', (req, res, next) => {
	res.render('signup', { title: 'Signup',
						   msg_type: '',
						   message: ''
						});
});

router.post('/signup', async (req, res, next) => {
	//console.log(req.body.user_name);
	//console.log(req.body.password);

  user_name = req.body.user_name;
	password = req.body.password;
  if ( user_name.length === 0 || password.length === 0){
		res.render('signup', {
                            msg_type: 'danger',
                            message: `ユーザー名またはパスワードが入力されていません。`
    });
  }else{
    const exists =  await User.check(user_name);
    if ( !exists ) {
      user = new User(user_name, {
        name: user_name
      })
      user.password = password;
      user.create().then((ret) => {
        //console.log('created', ret);
        //console.log(`user ${user_name} created`);
        res.redirect('/login');
      });
      //console.log('signup_post fine');
    } else {
      //console.log('user duplicate', user_name);
      res.render('signup', { msg_type: 'danger',
                   message: `ユーザー名 ${user_name} は既に登録されています。`
                 });
    }
  }
});

const home =  async (req, res, next) => {
	//console.log('term', req.params.term, req.session.term);
  const countFy = await models.FiscalYear.count();
  if ( countFy === 0 ){
    res.redirect('/setup');
  }else{
    if	( !req.params.term )	{
      if	( !req.session.term )	{
        let now = new Date('2020-10-10');	//	dummy
        //console.log(now);
        let fy = await models.FiscalYear.findOne({
          where: {
            [Op.and]:	{
              startDate: {
                [Op.lte]: now
              },
              endDate: {
                [Op.gte]: now
              }
            }
          }
        });
        //console.log(fy);
        if	( fy )	{
          req.session.term = fy.term;
        } else {
          req.session.term = 15;
        }
      }
      //console.log('term', req.session.term);
      res.render('home', {
                title: 'Home',
                msg_type: '',
                message: '',
                term: req.session.term,
                user: User.current(req)
              });
    } else {
      req.session.term = req.params.term;
      req.session.save(() => {
        res.redirect('/home');
      });
    }
  }
};

const setup  =  async (req, res, next) => {
  const countFy = await models.FiscalYear.count();
  if ( countFy === 0 ){
    res.render('setup', {
      title: 'Setup'
    });
  }else{
    res.redirect('/home');
  }
};
router.get('/', is_authenticated, home);
router.get('/setup', is_authenticated, setup);
router.get('/home/:term', is_authenticated, home);
router.get('/home', is_authenticated, home);

module.exports = router;
