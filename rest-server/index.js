var config = require('./config');
var server = require('./lib/server');

var app = server(config);

var server = app.listen(app.get('port'), function () {
    
    var host = server.address().address;
    var port = server.address().port;
    
    console.log(
        app.get('title'),
        'is running at: http://localhost:', 
        port
    );
    
});

app.use(app.controllers.auth());
app.use(app.controllers.companies());
app.use(app.controllers.agents());
app.use(app.controllers.users());

module.exports = app;
