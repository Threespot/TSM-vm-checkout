var db = require('./database');

// TEST: get all records.
db.getAllRecords(function(rows) {
	console.log('Got all rows. Length: '+ rows.length);
	
	var name = 'usr'+Math.random();
	
	// TEST: Put a record.
	db.putRecord(2, {id:2, user:name, checkout:''}, function() {
		console.log('Put row 2 with name: '+ name);
		
			// TEST: Get the record we just put, and compare results.
		db.getRecord(2, function(row) {
			console.log('Got row 2, whos name is: '+ row.user);
		});
	});
});