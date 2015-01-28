var passport = require('passport');
var ensureAuthenticated = require('../utils').ensureAuthenticated;

module.exports = function (app, router) {
    
    return function () {
        
        var route = '/agents';
        var Agent = app.models.agent;

        router
        
        .use(ensureAuthenticated)
        
        .get(route, function (req, res) {
            var agents = Agent.find({}, function (err, agents) {
                if (err) res.error(err);

                res.json(agents); 
            });
        });

        return router;
        
    };
};
