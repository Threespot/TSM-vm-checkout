var mysql = require('mysql');

/**
* Establish database connection.
*/
var db = mysql.createConnection({
	host: 'localhost',
	port: 8889,
	user: 'root',
	password: 'root',
	database: 'vmcheckout',
	typeCast: false
});

db.connect(function(err) {
	console.log(err ? 'Database connection failed.' : 'Connected to database.');
});

// Tests if a timestamp evaluates as being busy or not.
function isActive(timestamp) {
	return !!timestamp && timestamp.indexOf('0000') < 0;
}

// Gets all VM Records.
exports.getAllRecords = function(cb) {
	db.query("SELECT * FROM status ORDER BY id", function(err, rows) {
		cb(rows);
	});
};

// Gets a single VM Record by ID.
exports.getRecord = function(id, cb) {
	db.query("SELECT * FROM status WHERE id="+db.escape(id), function(err, rows) {
		if (rows.length) {
			cb(rows[0]);
		}
	});
};
		
// Updates a single VM Record with new data.
exports.putRecord = function(id, data, cb) {
	exports.getRecord(id, function(row) {
		// Test for any async conflicts.
		if (isActive(data.checkout) && isActive(row.checkout)) {
			// Conflict: return existing claim.
			cb(row);
			
		} else {
			// No conclict: allow claim.
			db.query("UPDATE status SET ? WHERE id="+db.escape(id), data, function(err, rows) {
				// Use the complete row record as base return, with new data applied.
				row.user = data.user;
				row.checkout = data.checkout;
				cb(row);
			});
		}
	});
};