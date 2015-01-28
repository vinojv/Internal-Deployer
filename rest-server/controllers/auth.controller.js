var passport = require('passport');

module.exports = function (app, router) {
    
    return function () {
        
        var route = '/auth';
        var User = app.models.User;
        var Company = app.models.Company;

        router
        
        .post(route + '/signup', function (req, res) {
            
            User.create({
                username: req.body.username,
                password: req.body.password
            }, function (err, user) {
                if (err) return res.send(err);
                res.json({ username: user.username, _id: user._id });
            });

        })

        .post(
            route + '/login', 
            passport.authenticate('local'),
            function (req, res) {
                res.json({ username: req.user.username, _id: req.user._id });
            }
        )

        .get(route + '/logout', function (req, res) {
            req.logout();
            res.send('Logged out successfully');
        })

        return router;
        
    };

};
