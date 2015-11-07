var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('./model/user');
var passportKeys = require('./config/secret/passport-keys');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.get(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: passportKeys.googleAuth.clientID,
            clientSecret: passportKeys.googleAuth.clientSecret,
            callbackURL: passportKeys.googleAuth.callbackURL,
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'google.id': profile.id}, function (error, user) {
                    if (error) return done(error);
                    if (user) return done(null, user);
                    User.add(
                        {
                            userId: profile.id,
                            token: token,
                            name: profile.displayName,
                            email: profile.emails[0].value
                        },
                        function (error, newUser) {
                            if (error) throw error;
                            return done(null, newUser);
                        });
                });
            });
        }));

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {
            User.findOne({email: username}, function (error, user) {
                if (error) return done(error);
                if (!user) return done(null, false, {message: 'Invalid credentials'});
                if (user.password != password) return done(null, false, {message: 'Invalid credentials'});
                return done(null, user);
            });
        }
    ));

};