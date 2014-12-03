var colors = require('colors');
var fs = Promise.promisifyAll(require("fs"));

module.exports = fs.readFile('../config.json', 'utf8')
    .then(function (data) {
        return JSON.parse(data);
    })
    .catch(function (err) {
        console.error(err);
    });