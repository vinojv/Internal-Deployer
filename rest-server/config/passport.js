var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, config) {
    
    var User = app.models.User;
    
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }

                // No user found with that username
                if (!user) { return done(null, false); }

                // Make sure the password is correct
                user.verifyPassword(password, function(err, isMatch) {
                    if (err) { return done(err); }

                    // Password did not match
                    if (!isMatch) { return done(null, false); }

                    // Success
                    return done(null, user);
                });
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};