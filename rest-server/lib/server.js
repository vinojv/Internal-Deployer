/*
 * Create the main application 
 */

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var _ = require('lodash');
var path = require('path');
var model = require('./models');
var boot = require('./boot');
var controller = require('./controllers');
var passport = require('passport');
var session = require('express-session');
var passportSetUp = require('../config/passport');
var sessionstore = require('sessionstore');

module.exports = function (config) {

    // set process title
    process.title = "deployer";
    
    // get express application
    var app = express();
    
    // perform boot actions
    app = boot(app, config);
    
    app.set('title', 'Deployer REST Server');
    app.set('rootPath', config.rootPath);
    app.set('port', config.server.port);
    
    // create models from definitions in models directory 
    model.createModels(config);
    
    // make models available as a property of app
    app.models = model.models;
    
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // parse application/json
    app.use(bodyParser.json());
    
    // enable sessions
    app.use(session({ 
        secret: config.session.secret,
        resave: false,
        saveUninitialized: true,
        store: sessionstore.createSessionStore({
            type: 'mongodb',
            host: config.datasource.location,
            port: config.datasource.port,
            dbName: config.datasource.database,
            collectionName: config.session.collection,
            timeout: 10000
        })
    }));
    
    // configure passport module
    passportSetUp(app, config);
    
    // register passport module with application
    app.use(passport.initialize());
    
    // allow passport to maintain session
    app.use(passport.session());
    
    // expose method to create and register new models
    app.model = app.Model = model.createModel;

    // create controllers from definitions in controllers directory
    controller.createControllers(config, app);
    
    // make controllers available as a property of app
    app.controllers = controller.controllers;
    
    return app;
    
};

