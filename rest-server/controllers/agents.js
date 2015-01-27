module.exports = function (app, router) {

    var Agent = app.models.agent;

    router
    .get('/agents', function (req, res) {
        var agents = Agent.find({}, function (err, agents) {
            if (err) res.error(err);

            res.json(agents); 
        });
    });


    return router;
};