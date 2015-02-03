/*
 * This module performs the following tasks:
 * - Initialize services -- cpu, ram, log, upd
 * - Initiates connection with server with respective credentials provided by the user
 * - 
 */

var fs = require('fs');
var request = require('request');
var commander = require('commander');
var chalk = require('chalk');
var q = require('q');
var config = require('./config');
var Agent = require('./lib/agent');

var authentication = q.defer();
var isAuthenticated = authentication.promise;
var agent;


commander
    .version('0.0.1')
    .option('-u, --user [value]', 'deployer username, you must already be registered')
    .option('-p, --password [value]', 'deployer password')
    .parse(process.argv);


/*
 * Quit if cmd-line auth arguments are insufficient    
 * commander.help() will display help and quit the process
 */
if ( !(commander.user && commander.password) ) commander.help();


// Attempt authentication with server
request.get(
    [config.deployer.location, ':', config.deployer.port, config.deployer.authUrl].join(''),
    {
        auth: {
            user: commander.user,
            pass: commander.password
        }
    }, 
    function (err, res, body) {
        if (err) return authentication.reject(err);
        
        if (res.statusCode == 200) {
            authentication.resolve(JSON.parse(body));
        } else {
            authentication.reject('Authentication with server failed, agent will now quit.');
        }
    }
);


isAuthenticated.then(
    // auth successful
    function (user) {
        console.log(chalk.green(
            'Authentication successful with user:',  
            chalk.underline(user.username), 
            '\b. Agent will now initialize.'));
        
        // TODO: perform agent init
        agent = new Agent(config, user);
    },
    
    // auth failed
    function (err) {
        // print error message and quit
        console.log( chalk.red(err) );
        process.exit();
    }
)


