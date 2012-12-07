/**
* Node application servers
* $ node index.js [server]
*/

// Check for requested server type.
var server = (process.argv[2] || 'rest'),
	port = 8080;

if (server === 'rest') {
	/**
	* REST server
	* @require express
	* @require mysql
	*/
	console.log('Starting REST server.');
	require("./lib/rest").start(port);
	
} else if (server === 'socket') {
	/**
	* Socket server
	* @require express
	* @require socket.io
	* @require mysql
	*/
	console.log('Starting socket server.');
	require("./lib/socket").start(port);
	
} else {
	// Invalid server parameter.
	console.log('Cannot start server "'+server+'"');
}