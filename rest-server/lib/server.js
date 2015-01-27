/*
 * Create the main application 
 */

var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');
var path = require('path');
var model = require('./models');
var boot = require('./boot');
var controller = require('./controllers');

module.exports = function (config) {
    
    var app = express();
    
    app = boot(app, config);
    
    app.set('title', 'Deployer REST Server');
    app.set('rootPath', config.rootPath);
    app.set('port', config.server.port);
    
    // create models from definitions in models directory 
    model.createModels(config);
    
    // expose method to create and register new models
    app.model = app.Model = model.createModel;

    // make models available as a property of app
    app.models = model.models;
    
    // create controllers from definitions in controllers directory
    controller.createControllers(config, app);
    
    // expose method to create and register new controllers
    app.controller = app.Controller = controller.createController;
    
    // make controllers available as a property of app
    app.controllers = controller.controllers;
    
    
    return app;
    
};

