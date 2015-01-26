/*
 * Create the main application 
 */

var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');
var path = require('path');
var createModels = require('./models');
var events = require('events');

module.exports = function (config) {
    
    var app = express();
    
    app.set('title', 'Deployer');

    // create connection to database
    mongoose.connect(
        'mongodb://' 
        + config.datasource.location 
        + '/' 
        + config.datasource.database
    );

    // make models available as a property of app
    app.models = createModels(config.models.path);
    
    return app;
    
};

//function Server (config) {
//    
//    // inherit properties from EventEmitter
//    events.EventEmitter.call(this);
//    
//    
//    
//}