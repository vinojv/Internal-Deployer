
/*
 * This modules creates controllers from files in controller folder
 *
 * Controllers created from files are named as their filenames
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var _string = require('underscore.string');
var router = require('express').Router();

var appControllers = exports.controllers = {};

var createControllers = exports.createControllers = 
    function createControllers (config, app) {
        
        var controllersDir = config.controllers.path;

        var controllerFiles = fs.readdirSync(controllersDir);

        controllerFiles.forEach(function (file) {
            // load controller module present in file
            var controllerModule = require(path.join(controllersDir, file));
            
            var controllerName = path.basename(file, '.controller.js');

            // get the model name exposed by module in both camel and pascal case
            var pascalCaseName = _string.classify(controllerName);
            var camelCaseName = _string.camelize(controllerName, true);

            // expose model name as both camel and pascal case properties
            appControllers[pascalCaseName] = appControllers[camelCaseName] = controllerModule(app, router);

        });
        
    };
