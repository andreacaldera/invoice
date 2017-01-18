const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('./model/user');
const passportKeys = require('./config/secret/passport-keys');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.get(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy(
    {
      clientID: passportKeys.googleAuth.clientID,
      clientSecret: passportKeys.googleAuth.clientSecret,
      callbackURL: passportKeys.googleAuth.callbackURL,
    },
    (token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne({ 'google.id': profile.id }, (error, user) => {
          if (error) return done(error);
          if (user) return done(null, user);
          User.add({
            userId: profile.id,
            token,
            name: profile.displayName,
            email: profile.emails[0].value,
          },
          (userAddError, newUser) => {
            if (userAddError) throw userAddError;
            return done(null, newUser);
          });
        });
      });
    }));

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
        (username, password, done) => {
          User.findOne({ email: username }, (error, user) => {
            if (error) return done(error);
            if (!user) return done(null, false, { message: 'Invalid credentials' });
            if (user.password !== password) return done(null, false, { message: 'Invalid credentials' });
            return done(null, user);
          });
        }
    ));
};
