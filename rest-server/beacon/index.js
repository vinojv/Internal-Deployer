var mongoose = require('mongoose');


module.exports = function (server) {
    
    return function () {
        
        var io = require('socket.io')(server);
        
    };
    
}