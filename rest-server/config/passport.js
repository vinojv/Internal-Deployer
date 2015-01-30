var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var DigestStrategy = require('passport-http').DigestStrategy;

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

    passport.use(new BasicStrategy(
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
    
    // TODO: implement digest authentication    
    passport.use(new DigestStrategy(
        { qop: 'auth' },
        function(username, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, user.password);
            });
        },
        function(params, done) {
            process.nextTick(function () {
                done(null, true)
            });
        }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};