module.exports = function (app, config) {
    
    var router = require('express').Router();
    var Company = app.models.Company;
    
    router.get('/companies', function (req, res, next) {
        var companies = Company.find({}, function (err, companies) {
            if (err) res.error(err);
            
            res.send(companies); 
        });
    });
    
    return router;
};