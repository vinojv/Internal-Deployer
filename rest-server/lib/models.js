/*
 * Export an object with all the models in '{rootDir}/models' as its properties
 */

var fs = require('fs');
var path = require('path');
var _string = require('underscore.string');

var createModels = function (modelsDir) {
    
    var appModels = {};

    var modelFiles = fs.readdirSync(modelsDir);

    modelFiles.forEach(function (file) {
        // load module present in file
        var modelModule = require(path.join(modelsDir, file));

        // get the model name exposed by module in both camel and pascal case
        var pascalCaseName = _string.camelize('_' + modelModule.model.modelName);
        var camelCaseName = _string.camelize(modelModule.model.modelName, true);

        // expose model name as both camel and pascal case properties
        appModels[pascalCaseName] = appModels[camelCaseName] = modelModule.model;

    });
    
    return appModels;
    
};

module.exports = createModels;