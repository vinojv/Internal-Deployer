Deployer Requirement and Implementation Reference
=================================================

Following the main parts of Deployer:
*	REST Server
*	Central Dispatcher
*	Distributed Agents
*	Logger


###	Flow:
REST    =>    Central Dispatcher    =>    Agents


###	REST Server:
-	Authenticates Client
-	Communicates with the client
-	Receives commands from the clients and forwards it to the Central Dispatcher
-	Forwards responses from the Central Dispatcher to the respective clients
-	Reads and formates data in Logger and forwards it to client on their demand
	

###	Central Dispatcher
-	Distributes commands to Agents
-	Collects responses from Clients and forwards it to REST Server
-	Checks for heartbeats from Clients
-	CD is responsible for authenticating Agents


###	Logger
-	Provides remote logging server over UDP protocol
-	Responsible for querying data in logger
-	Stores logged data in a predetermined finite amount of memory by reducing the frequency of data
	storage over time. (Whisper | Mongodb)


###	Distributed Agents
-	Runs on the hosted servers and collect their runtime metrics such as CPU, Memory
-	Receive commands from Central Dispatcher and run them locally on hoster servers
-	Stream processes' SDTOUT back to the Central Dispatcher
-	Collect and log processes' resource consumption such and CPU, Memory and Network
-	Provide remote terminal access over HTTP sockets


##	Routes and POJO Structure

* user *:  
```javascript
	{
		user
	}
```



##	Routes

* POST /auth/login *  
	REQ:	` { email: 'string', password: 'string' } `  
	RES:	` { id: 'string', email: 'string', name: 'string' } `  

* GET /auth/logout *
	RES:	` CODE `

*  *





