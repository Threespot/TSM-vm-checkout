var express = require("express"),
	db = require("./database"),
	path = require('path'),
	app = express.createServer();

exports.start = function(port) {
	
	// Configure app with static file server, POST parser, and router.
	app.configure(function() {
		app.use(express.bodyParser());
		app.use(app.router);
		app.use(express.static(__dirname + '/../public'));
	});

	// Serve REST client page as the root index.
	app.get('/', function(req, res) {
		res.sendfile( path.normalize(__dirname + '/../public/rest.html') );
	});

	// Get all VM records.
	app.get('/api', function(req, res) {
	    db.getAllRecords(function(rows) {
			res.end(JSON.stringify(rows));
		});
	});

	// Get a single VM data record.
	app.get('/api/:id', function(req, res) {
		db.getRecord(req.params.id, function(row) {
			res.end(JSON.stringify(row));
		});
	});

	// Update a single VM data record.
	app.post('/api/:id', function(req, res) {
		db.putRecord(req.params.id, req.body, function(row) {
			res.end(JSON.stringify(row));
		});
	});

	app.listen(port);
	console.log("Server running on port "+port+".");
};