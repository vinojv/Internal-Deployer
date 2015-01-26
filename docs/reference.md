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



##	Schema

#### Companies
```javascript
{
	id: 'ObjectID',
	name: 'String',
	users: ['UserID'], // user belonging to the company
	agents: ['AgentID'] // agents deployed by the company (one per host)
}
```

#### Users
```javascript
{
	id: 'ObjectID',
	name: 'String',
	email: 'String',
	company: 'CompanyID', // company that the user belongs to
	agents: ['AgentID'] // agents that the user has access to
}
```

#### Hosts
```javascript
{
	id: 'ObjectID',
	name: 'String', // host or instance name
	cpu: 'String', // CPU model
	cores: 'Number', // number of CPU cores
	memory: 'Number', // total host memory in GBs,
	os: 'String' // host operating system name
}
```


#### Agents
```javascript
{
	id: 'ObjectID',
	host: 'HostID',
	company: 'CompanyID',
	users: ['UserID']
}
```

#### Processes
```javascript
{
	id: 'ObjectID',
	pid: 'string', // process's PID
	user: 'UserID', // user that forked this process
	agent: 'AgentID'
}
```

#### Monitors
```javascript
{
	id: 'ObjectID',
	processes: ['ProcessID'],
	agent: 'AgentID'
}





