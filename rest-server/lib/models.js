/*
 * Export an object with all the models in '{rootDir}/models' as its properties
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var _string = require('underscore.string');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var appModels = {};

var createModels = function (config) {
    
    var modelsDir = config.models.path;

    var modelFiles = fs.readdirSync(modelsDir);

    modelFiles.forEach(function (file) {
        // load module present in file
        var modelModule = require(path.join(modelsDir, file));

        // get the model name exposed by module in both camel and pascal case
        var pascalCaseName = _string.classify(modelModule.model.modelName);
        var camelCaseName = _string.camelize(modelModule.model.modelName, true);

        // expose model name as both camel and pascal case properties
        appModels[pascalCaseName] = appModels[camelCaseName] = modelModule.model;

    });
    
};

var createModel = function (modelName, schema) {
    
    var existingModels = _.keys(appModels);
    
    // check if model already exists with same name
    var modelIndex = _.findIndex(existingModels, function (existingName) { return modelName == existingName; });
    
    if (modelIndex != -1) {
        console.warn('A model with name: `%s` already exists');
        return null;
    }
    
    try {
        // create new mongoose model with the schema that was passed
        var model = mongoose.model(modelName, new Schema(schema));
        
        // get the model name exposed by module in both camel and pascal case
        var pascalCaseName = _string.classify(modelName);
        var camelCaseName = _string.camelize(modelName, true);

        // add new model to models list as both camel and pascal cased names
        appModels[pascalCaseName] = appModels[camelCaseName] = model;
        
        return model;
        
    } catch (err) {
        console.warn('Error creating model! \n', err);
        return null;
    }
    
};


exports.createModels = createModels;
exports.createModel = createModel;
exports.models = appModels;

