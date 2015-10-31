var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('./model/user');
var passportKeys = require('./config/secret/passport-keys');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
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
                User.findOne({'google.id': profile.id}, function (err, user) {
                    if (err) return done(err);
                    if (user) return done(null, user);

                    var newUser = new User();
                    newUser.userId = profile.id;
                    newUser.token = token;
                    newUser.name = profile.displayName;
                    newUser.email = profile.emails[0].value;
                    newUser.save(function (err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                });
            });

        }));

};
