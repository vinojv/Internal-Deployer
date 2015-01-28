var passport = require('passport');
var ensureAuthenticated = require('../utils').ensureAuthenticated;
var sendDbResponse = require('../utils').sendDbResponse;

module.exports = function (app, router) {
    
    return function () {
        
        var route = '/companies';
        var Company = app.models.Company;
        var Agent = app.models.Agent;

        // set up the router
        router
        
        .use(ensureAuthenticated)

        .get(route, function (req, res) {
            Company.find(sendDbResponse(req, res));
        })

        .get(route + '/:id', function (req, res) {
            Company.findById(req.params.id, sendDbResponse(req, res));
        })

        .post(route, function (req, res) {
            Company.create({ name: req.body.name }, sendDbResponse(req, res));
        })

        .put(route, function (req, res) {
            Company.create({ name: req.body.name }, sendDbResponse(req, res));
        })

        .put(route + '/:id', function (req, res) {
            Company.findByIdAndUpdate(
                req.params.id,
                { name: req.body.name }, 
                sendDbResponse(req, res)
            );
        })

        .delete(route + '/:id', function (req, res) {
            Company.findByIdAndRemove(req.params.id, sendDbResponse(req, res));
        })

        .post(route + '/:companyId/agent', function (req, res) {
            Company.findByIdAndUpdate(req.params.companyId).exec()
            .then(function (company) {
                return Agent.create({ 
                    host: req.body.host,
                    company: req.params.companyId
                });
            })
            .then(function (data) {
                res.send(data);
            }, function (err) {
                res.send(err);
            });

        })

        return router;    
        
    };
    
};
