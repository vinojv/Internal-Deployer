var passport = require('passport');

module.exports = function (app, router) {
    
    return function () {
        
        var route = '/auth';
        var User = app.models.User;
        var Company = app.models.Company;

        router
        
        .post(route + '/signup', function (req, res) {
            
            Company.findOne({ name: req.body.company }).exec()
            .then(function (company) {
                // if a company exists in the db, then throw error and break chain
                if (company) {
                    throw 'A company with that name exists.' 
                         + ' If you\'re a member of the same company,'
                         + ' then you may ask an existing member to add you.';
                }
                
                // else create a new company by that name
                return Company.create({ name: req.body.company });
            })
            .then(function (company) {
                // create a new user with the details provided
                return User.create({
                    username: req.body.username,
                    password: req.body.password,
                    company: company._id
                })
            })
            .then(function (user) {
                // add user to list of users of that company
                Company.findByIdAndUpdate(
                    user.company,
                    { $push: { users: user._id } }
                ).exec()
            })
            .then(
                function (data) {
                    res.json({ username: req.body.username });
                },
                function (err) {
                    res.send(err);
                }
            );

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
