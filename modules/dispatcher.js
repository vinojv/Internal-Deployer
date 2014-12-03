function invokeCommand (cmd) {

    var child = shell.exec(cmd, {async:true});

    child.stdout.on('data', function(data) { 
        io.emit('response', data);
    });

    child.on('close', function () {
        io.emit('success');
    });

}

var dispatcher = function (config) {
    
    
    
};

var actions = {
    '/svn/update': function () {
        console.log('\n\n ==== Updating SVN Server ==== \n\n');
        invokeCommand('cd ../blazent/; svn update;');
    },

    '/server/build': function () {
        console.log('\n\n ==== Building Server ==== \n\n');
        invokeCommand('cd ../blazent/gui; mvn clean install;');
    },

    '/server/stop': function () {
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

    '/server/restart': function () {
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