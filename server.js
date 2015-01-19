var express = require('express');
var shell = require('shelljs');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var filewatcher = require('filewatcher');

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var gotoServer = 'cd ' +  config.server.path;
var gotoClient = 'cd ' + config.client.path;

app.use(express.static(__dirname + '/client'));

io.on('connection', function(socket) {

    console.log('New Client Connected');

    socket.on('command', function (url) {
        //        console.log(url);
        dispatcher[url]();
    });

    socket.on('custom-command', function (cmd) {
        cmd = gotoServer + '; ' + cmd;
        invokeCommand(cmd);
    });

});

function invokeCommand (cmd) {

    var child = shell.exec(cmd, {async:true});
    
    io.emit('response',  '\n'  +  cmd +  '\n');

    child.stdout.on('data', function(data) { 
        io.emit('response', data);
    });
    
    child.stderr.on('data', function(data) { 
        io.emit('response', data);
    });

    child.on('close', function () {
        io.emit('success');
    });

}

var dispatcher = {
    '/actions/svn/update': function () {
        console.log('\n\n ==== Updating SVN Server ==== \n\n');
        var cmd = gotoServer + '; svn update;';
        invokeCommand(cmd);
    },

    '/actions/server/build': function () {
        console.log('\n\n ==== Building Server ==== \n\n');
        var cmd = gotoServer 
        + config.server.build.location + '; '
        + config.server.build.command;
        invokeCommand(cmd);
    },

    '/actions/server/stop': function () {
        console.log('\n\n ==== Stopping Server ==== \n\n');
        var cmd = 'netstat -tupln | grep ' + config.server.port;
        io.emit('response',  '\n'  +  cmd +  '\n');
        var child = shell.exec(cmd, {async: true});
        var netstat = '';

        child.stdout.on('data', function (data) {
            netstat += data;
            io.emit('response', data);
        });

        child.on('close', function () {
            if (!netstat.match('java')) {
                io.emit('response', 'Jetty wasn\'t found, perhaps you should try looking in your drawer.');
            } else {
                var pid = netstat.trim().split(/\s/)[netstat.trim().split(/\s/).length - 1].replace('/java', '');
                console.log('Terminating: ', pid);
                var kill = shell.exec('kill ' + pid, {async: true});
                kill.on('close', function () {
                    io.emit('response', 'Jetty was found and killed brutally');
                    io.emit('success');
                });
            }
        });
    },

    '/actions/server/restart': function () {
        console.log('\n\n ==== Restarting Server ==== \n\n');
        var cmd = 'netstat -tupln | grep ' + config.server.port;
        io.emit('response',  '\n'  +  cmd +  '\n');
        var child = shell.exec(cmd, {async: true});
        var netstat = '';

        child.stdout.on('data', function (data) {
            netstat += data;
            io.emit('response', data);
        });

        child.on('close', function () {
            if (!netstat.match('java')) {
                console.log( 'Jetty isn\'t running already.' )
            } else {
                var pid = netstat.trim().split(/\s/)[netstat.trim().split(/\s/).length - 1].replace('/java', '');
                //				console.log('Killing: ', pid);
                shell.exec('kill ' + pid, {async: false});
            }

            //			cmd = 'cd ../blazent/gui/target; java -jar rest-server-jar-with-dependencies.jar &';
            cmd = gotoServer 
            + config.server.jar.location 
            + '; java -jar '
            + config.server.jar.name + ' &';
            io.emit('response',  '\n'  +  cmd +  '\n');
            //            console.log('\n', cmd, '\n');
            var jetty = shell.exec(cmd, {async:true});
            var jettyResponse = '';

            jetty.stdout.on('data', function (data) {
                jettyResponse += data;
                io.emit('response', data);

                if(jettyResponse.match('Server Started')) {
                    io.emit('success');
                }
                // TODO: handle unsuccessful run
            });
        });		
    },
    
    '/actions/git/pull': function () {
        console.log('\n\n ==== Updating Client ==== \n\n');
        var cmd = gotoClient + '; git pull;'
        invokeCommand(cmd);
    },
    
    '/actions/gulp/dist': function () {
        console.log('\n\n ==== Building Client ==== \n\n');
        var cmd = gotoClient + '; gulp dist;'
        invokeCommand(cmd);
    }
}

function logWatcher (path) {

    var currSize = fs.statSync(path).size;
    var watcher = filewatcher({ interval: 1000 });

    watcher.add(path);

    watcher.on('change', function (file, stat) {
        //		console.log('\nFile Changed\n', stat.size, currSize);
        fs.stat(path, function (err, stat) {
            readFileSection(currSize, stat.size);
            currSize = stat.size;
        });
    });

    function readFileSection (prev, curr) {
        //		console.log('curr: ', curr, 'prev:', prev);

        if ( curr < prev ) return;

        var readStream = fs.createReadStream(path, {
            encoding: 'utf8',
            start: prev,
            end: curr
        });

        readStream.on('data', function (data) {
            io.emit('log', data);
            //			console.log(data);
        });
    }

}

var server = http.listen(8090, function() {

    var host = server.address().address;
    var port = server.address().port;

    // var logFile = '/var/log/blazent/services.log';
    // var logFile = config.server.logs.location + config.server.logs.name;

    // io.emit('log', 'Watching log file: ' + logFile);
    // logWatcher(logFile);

    console.log('Internal Deployer listening at http://%s:%s', host, port);

});
