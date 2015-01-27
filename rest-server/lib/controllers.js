
/*
 *
 *
 * Controllers created from files are named as their filenames
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var _string = require('underscore.string');

var appControllers = exports.controllers = {};

// this wont work yet
var createController = exports.createController = 
    function createController (controllerName, controllerFn) {
        
        var existingControllers = _.keys(appControllers);

        // check if model already exists with same name
        var controllerIndex = _.findIndex(
            existingControllers, 
            function (existingName) { return controllerName == existingName; }
        );

        if (controllerIndex != -1) {
            console.warn('A controller with name: `%s` already exists');
            return null;
        }
        
        // get the model name exposed by module in both camel and pascal case
        var pascalCaseName = _string.classify(controllerName);
        var camelCaseName = _string.camelize(controllerName, true);
        
        appControllers[pascalCaseName] = appControllers[camelCaseName] = controllerFn(app);
    
    };

var createControllers = exports.createControllers = 
    function createControllers (config, app) {
        
        var controllersDir = config.controllers.path;

        var controllerFiles = fs.readdirSync(controllersDir);

        controllerFiles.forEach(function (file) {
            // load controller module present in file
            var controllerModule = require(path.join(controllersDir, file));
            
            var controllerName = path.basename(file, '.js');

            // get the model name exposed by module in both camel and pascal case
            var pascalCaseName = _string.classify(controllerName);
            var camelCaseName = _string.camelize(controllerName, true);

            // expose model name as both camel and pascal case properties
            appControllers[pascalCaseName] = appControllers[camelCaseName] = controllerModule(app);

        });
        
    };

//module.exports = function (app, config) {
//
//    var router = require('express').Router();
//
//    router.get('/companies', function (req, res, next) {
//        res.send('Worked!!! Well, kinda');
//    });
//
//    return router;
//
//};