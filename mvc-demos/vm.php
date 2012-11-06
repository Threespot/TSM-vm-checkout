<?php
/*
// APP SERVER
$link = mysql_connect('127.0.0.1', 'vmcheckout', 'f42e0b109d26cd8df0f04177d4cb8424');
if (!$link) { 
    die('Could not connect: ' . mysql_error()); 
} 
mysql_select_db(vmcheckout);
*/

// LOCALHOST
$link = mysql_connect('localhost', 'root', 'root');
if (!$link) { 
    die('Could not connect: ' . mysql_error()); 
} 
mysql_select_db(vmcheckout);

/**
* Virtual Machine record definition.
*/
class VM {
	var $id;
	var $vm;
	var $user;
	var $checkout;
	
	// Constructor: builds from a database record.
	function VM($raw) {
		$this->id = $raw['id'];
		$this->vm = $raw['vm'];
		$this->user = $raw['user'];
		$this->checkout = $raw['checkout'];
	}
	
	// Tests if the VM is currently checked out (has a timestamp).
	function is_busy() {
		return (strpos($this->checkout, '0000') === FALSE);
	}
	
	// Tests a checked-out VM's timestamp against an expiration time.
	// VM is vacated if its checkout time is before expiration date.
	function expire($time) {
		if ($this->is_busy()) {
			if (strtotime($this->checkout) < strtotime($time)) {
				// Exprire the record...
				// Now being done with a SQL query.
			}
		}
	}
	
	// Checks-out an 
	function checkout($user, $checkout) {
		$vacate = strlen($user) < 1; // << Establish if new request is clearing the user.
		
		// Commit new user if:
		// - The VM is being vacated, or...
		// - The VM is not already busy (prevents out-of-sync UI from claiming occupied slots)
		if ($vacate || !$this->is_busy()) {
			$result = mysql_query("UPDATE status SET user='$user', checkout='$checkout' WHERE id=$this->id");
			$this->checkout = $checkout;
			$this->user = $user;
		}
	}
}


switch($_SERVER['REQUEST_METHOD']) {
	case GET:
		// Reset all checkouts from before today. Requested once upon initial application load.
		if (isset($_GET['reset'])) {
			$today = date('Y-m-d 00:00:00');
			$result = mysql_query("UPDATE status SET user='', checkout='' WHERE checkout < '$today'");
		}
		
		// Select all VM records.
		$result = mysql_query("SELECT * FROM status ORDER BY id");
		$rows = array();
		
		while($item = mysql_fetch_array( $result )) {
			$rows[] = new VM($item);
		}
		
		// Print out VM records as JSON data.
		echo json_encode( $rows );
		break;
		
	case DELETE:
		$_DELETE = json_decode( file_get_contents('php://input'), true );
		break;
		
	case PUT:
		// Collect all PUT variables.
		$_PUT = json_decode( file_get_contents('php://input'), true );
		$id = intval( mysql_real_escape_string($_PUT['id']) );
		$user = mysql_real_escape_string($_PUT['user']);
		$checkout = mysql_real_escape_string($_PUT['checkout']);
		
		// Get current checkout record for this VM.
		$result = mysql_query("SELECT * FROM status WHERE id=$id");
		$vm = new VM( mysql_fetch_array($result) );
		$vm->checkout($user, $checkout);
		
		// Return resolved checkout record.
		echo json_encode( $vm );
		break;
		
	case POST:
		break;
}

?>