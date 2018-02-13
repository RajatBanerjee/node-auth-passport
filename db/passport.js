var LocalStrategy = require('passport-local').Strategy;
var User = require('./user.js');
module.exports = function (passport) {

    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function (id, cb) {
        User.findById(id, function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({ 'local.email': email }, function (err, user) {
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        })
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({ 'local.email': email }, function (err, user) {
            if (err)
                return done(err);

            // if no user is found, return the message
            if (user)
                return done(null, false, req.flash('user already exists')); // req.flash is the way to set flashdata using connect-flash
            else {
                var newUser = new User();
                // set the user's local credentials
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                // save the user
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }))
}