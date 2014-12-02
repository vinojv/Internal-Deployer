var express = require('express');
var shell = require('shelljs');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var filewatcher = require('filewatcher');

app.use(express.static(__dirname + '/client'));

io.on('connection', function(socket){
  console.log('New client connected');

  socket.on('command', function (url) {
  	console.log(url);
  	dispatcher[url]();
  });

  socket.on('custom-command', function (cmd) {
  	cmd = 'cd ../blazent/; ' + cmd;
  	invokeCommand(cmd);
  });

});

function invokeCommand (cmd) {

	var child = shell.exec(cmd, {async:true});
    
    child.stdout.on('data', function(data) { 
    	io.emit('response', data);
    });

    child.on('close', function () {
    	io.emit('success');
    });

}

var dispatcher = {
	'/actions/svn/update': function () {
		console.log('\n\n ==== Updating SVN Server ==== \n\n');
		invokeCommand('cd ../blazent/; svn update;');
	},

	'/actions/server/build': function () {
		console.log('\n\n ==== Building Server ==== \n\n');
		invokeCommand('cd ../blazent/gui; mvn clean install;');
	},

	'/actions/server/stop': function () {
		console.log('\n\n ==== Stopping Server ==== \n\n');
		
		var child = shell.exec('netstat -tupln | grep 8081', {async: true});
		var netstat = '';
		
		child.stdout.on('data', function (data) {
			netstat += data;
			io.emit('response', data);
		});

		child.on('close', function () {
			if (!netstat.match('java')) {
				io.emit('response', 'Jetty isn\'t running already.');
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

		var child = shell.exec('netstat -tupln | grep 8081', {async: true});
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
				console.log('Killing: ', pid);
				shell.exec('kill ' + pid, {async: false});
			}

			var command = 'cd ../blazent/gui/target; java -jar rest-server-jar-with-dependencies.jar &';
			var jetty = shell.exec(command, {async:true});
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
	}
}

function logWatcher (path) {

	console.log('Watching file: ' + path);

	var currSize = fs.statSync(path).size;
	var watcher = filewatcher({ interval: 1000 });
	
	watcher.add(path);

	watcher.on('change', function (file, stat) {
		console.log('\nFile Changed\n', stat.size, currSize);
		fs.stat(path, function (err, stat) {
			readFileSection(currSize, stat.size);
			currSize = stat.size;
		});
	});

	function readFileSection (prev, curr) {
		console.log('curr: ', curr, 'prev:', prev);

		if ( curr < prev ) return;

		var readStream = fs.createReadStream(path, {
			encoding: 'utf8',
			start: prev,
			end: curr
		});

		readStream.on('data', function (data) {
			io.emit('log', data);
			console.log(data);
		});
	}

}

var server = http.listen(8090, function() {

    var host = server.address().address;
    var port = server.address().port;

    var logFile = '/var/log/blazent/services.log';

    io.emit('log', 'Watching file: ' + logFile);
    logWatcher(logFile);

    console.log('Internal Deployer listening at http://%s:%s', host, port);

});
