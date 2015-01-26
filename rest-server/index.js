var config = require('./config');

var server = require('./lib/application');

var app = server(config);

app.listen(config.server.port);
console.log('Deployer REST Server running at: http://localhost:' + config.server.port);

module.exports = app;
