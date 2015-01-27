module.exports = function (app, router) {
    
    var route = '/companies';
    var Company = app.models.Company;
    var Agent = app.models.Agent;
    
    var sendResponse = function (req, res) {
        return function (err, companies) {
            if (err) return res.send(err);
            
            res.send(companies); 
        };
    };

    
    router
    .get(route, function (req, res) {
        Company.find(sendResponse(req, res));
    })
    
    .get(route + '/:id', function (req, res) {
        Company.findById(req.params.id, sendResponse(req, res));
    })
    
    .post(route, function (req, res) {
        Company.create({ name: req.body.name }, sendResponse(req, res));
    })
    
    .put(route, function (req, res) {
        Company.create({ name: req.body.name }, sendResponse(req, res));
    })
    
    .put(route + '/:id', function (req, res) {
        Company.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name }, 
            sendResponse(req, res)
        );
    })
    
    .delete(route + '/:id', function (req, res) {
        Company.findByIdAndRemove(req.params.id, sendResponse(req, res));
    })
    
    .post(route + '/:id/agent', function (req, res) {
        var promise = Company.findByIdAndUpdate(req.params.id).exec();
            
        promise
        .then(function (company) {
            return Agent.create({ 
                host: req.body.host,
                company: company._id
            });
        })
        .then(function (data) {
            res.send(data);
            console.log(data);
        }, function (err) {
            res.send(err);
        });
    
    })
    
    
    
    return router;
};