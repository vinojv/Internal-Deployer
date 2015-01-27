var express = require('express');
var http = require('http');
var _ = require('lodash');

var app = express();

http.createServer(app).listen(8080);

var appKeys = _.keys(express.application);
var expresKeys = _.keys(express);

console.log('appKeys', appKeys)
console.log('expressKeys', expresKeys)

console.log(express.application.trace);