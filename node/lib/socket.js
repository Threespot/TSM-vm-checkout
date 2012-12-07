var express = require("express"),
	app = express.createServer(),
	io = require('socket.io').listen(app),
	db = require("./database"),
	path = require('path');

exports.start = function(port) {
	
	// Configure app with static file server, POST parser, and router.
	app.configure(function() {
		app.use(app.router);
		app.use(express.static(__dirname + '/../public'));
	});

	// Turn off socket debug logging.
	io.configure(function() {
		io.disable('log level');
	});

	// Serve the socket client page as the root index.
	app.get('/', function(req, res) {
		res.sendfile( path.normalize(__dirname + '/../public/socket.html') );
	});

	// Configure connection sockets.
	io.sockets.on('connection', function(socket) {

		// Send all data to new socket connections.
		db.getAllRecords(function(rows) {
			socket.emit('data', rows);
		});
	
		// Save and broadcast changes to all sockets.
		socket.on('change', function(data) {
			db.putRecord(data.id, data, function(row) {
				socket.broadcast.emit('update', row);
			});
		});
	});

	app.listen(port);
	console.log("Server running on port "+port+".");
};