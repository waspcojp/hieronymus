import models from '../models/index.js';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

import _passport from 'passport';
import local from 'passport-local';
const Local = local.Strategy;

_passport.use(new Local({
    usernameField: 'user_name',
    passwordField: 'password',
    passReqToCallback: true,
    session: true,
  }, (req, user_name, password, done) => {
    console.log('user_name', user_name);
    console.log('password', password);
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

_passport.serializeUser((user, done) => {
  //console.log('serialize:', user);
  done(null, user);
});

_passport.deserializeUser((user, done) => {
  //console.log('deserialize:', user);
  done(null, user);
});

export const passport = _passport;

export	const	is_authenticated = (req, res, next) => {
  //console.log(req.session);

  if ( req.isAuthenticated() ) {
    return (next());
  } else {
    res.redirect('/login');
  }
}

export	const	auth_user = (name, password) => {
  console.log('auth_user', {name}, {password})
  return new Promise((done, fail) => {
    models.User.findOne({
      where: {
        name: name },
    }).then((user) => {
      console.log(user);
      if ( user ) {
        console.log(user.hashPassword)
        if  ( !user.hashPassword  ||  bcrypt.compareSync(password, user.hashPassword) ) {
          console.log("auth ok");
          done(user);
        } else {
          console.log("auth fail");
          fail(user);
        }
      } else {
        console.log("user none");
        fail(null);
      }
    });
  });
}
export const   passwd = (name, old_pass, new_pass) => {
    //console.log('passwd', user.name, old_pass, new_pass);
    return new Promise((done, fail) => {
      auth_user(name, old_pass).then((user) => {
        user.hashPassword = bcrypt.hashSync(new_pass, SALT_ROUNDS);
        user.save().then(() => {
        done(true);
      }).catch(() => {
        done(false);
      });
    }).catch (() => {
      done(false);
    });
  });
}


export default {
  is_authenticated: is_authenticated,
  auth_user: auth_user,
  passwd: passwd,
  passport: passport
};
