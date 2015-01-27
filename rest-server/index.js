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

//app.model('Event', { name: { type: String, unique: true } });
//
//var Event = app.models.event;
//Event.create({ name : "Some event name" }, function (err, event) { console.log(event) });

app.use(app.controllers.company);


module.exports = app;
