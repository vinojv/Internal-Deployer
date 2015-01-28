var ensureAuthenticated = require('../utils').ensureAuthenticated;

module.exports = function (app, router) {
    
    return function () {
    
        var route = '/users';
        var User = app.models.User;

        router
        
        .use(ensureAuthenticated)
        
        .post(route, function (req, res) {
            
        })

        return router;
    
    };
    
};

//console.log('In user');
