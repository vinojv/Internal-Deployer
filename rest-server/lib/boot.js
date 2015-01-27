/*
 * This module contains actions to be performed prior to creating server.
 */

var mongoose = require('mongoose');
var models = require('./models');
var controllers = require('./controllers')

module.exports = function (app, config) {

    // create connection to database
    mongoose.connect(
        'mongodb://' 
        + config.datasource.location 
        + '/' 
        + config.datasource.database
    );
    
    return app;
    
};