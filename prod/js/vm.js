// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

// JSLint options:
/*global $, ko */
/*jslint browser:true, white:true, plusplus:true, vars:true */

/**
* VM Checkout
* @author Greg MacWilliam
* @requires Zepto / jQuery
* @requires Knockout.js
*/
$(function() {
	"use strict";
	
	/**
	* Date formatting utilities.
	*/
	(function() {
		function d2(d) {
		    if (0 <= d && d < 10) return "0" + d.toString();
		    if (-10 < d && d < 0) return "-0" + (-1*d).toString();
		    return d.toString();
		}
		Date.prototype.toPrettyTime = function() {
		    return (this.getHours() % 12 || 12) +':'+ d2(this.getMinutes()) +' '+ (this.getHours() < 12 ? 'AM' : 'PM');
		};
		Date.prototype.toMysqlFormat = function() {
		    return this.getFullYear() 
				+"-"+ d2(1 + this.getMonth())
				+"-"+ d2(this.getDate()) 
				+" "+ d2(this.getHours())
				+":"+ d2(this.getMinutes())
				+":"+ d2(this.getSeconds());
		};
		Date.fromMysqlFormat = function(timestamp) {
		    var regex = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/,
				parts = timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
			return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
		};
	}());
	
	/**
	* Sync button info tooltip.
	*/
	(function() {
		var tooltip = $("#sync-info");

		$("#sync").on('mouseover', function(evt) {
			tooltip.css({opacity:0}).show().animate({opacity:1}, 200);
		}).on('mouseout', function(evt) {
			tooltip.hide();
		});
	}());
	
	/**
	* Conflict alert window.
	*/
	var VMAlert = (function() {
		var alert = $("#vm-alert"),
			doc = $(document),
			win = $(window),
			resize = function() {
				alert.height( Math.max(doc.height(), win.height()) );
			};
		
		// Set alert overlay to max(document/window) height.
		$(window).on('resize', resize);
		resize();
		
		// Close alert window when overlay or any dismissal button is clicked.
		alert.on('click', function(evt) {
			var target = $(evt.target);
			if (target.is('#vm-alert') || target.is('button')) {
				alert.animate({opacity:0}, 200, 'ease-out', function() {
					alert.hide();
				});
			}
		});
		
		return {
			conflict: function(name) {
				alert.find('span.user').text( name );
				alert.css('opacity', 0).show().animate({opacity:1}, 300);
			}
		};
	}());
	
	/**
	* View-model for each individual VM.
	*/
	var VMItem = function(data) {
		// VM attributes.
		this.vm = data.vm;
		this.index = parseInt(data.id, 10);
		this.user = ko.observable(data.user);
		this.timestamp = ko.observable( this.formatTimestamp(data.checkout) );
		
		// Specifies if the VM is currently occupied (tests for valid timestamp).
		this.isBusy = ko.computed(function() {
			return this.timestamp().length > 0;
		}, this);
		
		// Formats the timestamp for display within the view.
		this.timestampLabel = ko.computed(function() {
			return this.timestamp() ? Date.fromMysqlFormat( this.timestamp() ).toPrettyTime() : '';
		}, this);
		
		// Defines a label for the VM's currently available user action.
		this.actionLabel = ko.computed(function() {
			return this.isBusy() ? 'Vacate' : 'Claim';
		}, this);
		
		// Formats a URL for sending the user's name off to the dispute page.
		this.disputeLink = ko.computed(function() {
			return 'disputes.html?offender=' + this.user().split(' ').join('+');
		}, this);
	};
	
	VMItem.prototype = {
		// Validates a timestamp's formatting, defaulting to empty for zeroed dates.
		formatTimestamp: function(timestamp) {
			return timestamp.indexOf('0000') < 0 ? timestamp : '';
		},
		
		// Receives keyboard input from username form field.
		// Submits a claim upon pressing the RETURN key.
		keySubmit: function(target, evt) {
			if (evt.keyCode === 13) {
				$('input:focus').blur();
				this.claim();
				return false;
			}
			return true;
		},
		
		// Toggles the checkout status of a VM.
		toggle: function() {
			if (this.isBusy()) {
				this.vacate();
			} else {
				this.claim();
			}
		},
		
		// Vacates the VM by clearing any existing user and timestamp.
		vacate: function() {
			this.user('');
			this.timestamp('');
			this.send();
		},
		
		// Claims the VM by locking in a checkout time.
		// VM's may only be claimed when a user name has been entered.
		claim: function() {
			if (this.user().length) {
				this.timestamp( new Date().toMysqlFormat() );
				this.send();
			}
		},
		
		// Refreshes the VM record with new server data.
		refresh: function(data, validate) {
			if (this.index === parseInt(data.id, 10)) {
				validate = (validate && this.user() !== data.user);
				this.user(data.user);
				this.timestamp( this.formatTimestamp(data.checkout) );
				
				if (validate) {
					VMAlert.conflict(this.user());
				}
			}
		},
		
		// Sends current VM configuration to the server.
		send: function() {
			var self = this;
			
			$.ajax({
				url:'vm.php',
				type:'PUT',
				dataType:'json',
				data:'{"id":'+ this.index +',"user":"'+ this.user() +'","checkout":"'+ this.timestamp() +'"}',
				success:function(data) {
					self.refresh(data, true);
				}
			});
		}
	};
	
	/**
	* Master view-model for complete list of VMs
	*/
	var VMList = function() {
		var self = this,
			reset = '?reset=1',
			pending,
			loadData,
			parseData;
		
		// List of VMItems.
		this.vmList = ko.observableArray([]);
		this.sync = ko.observable(!localStorage.sync || localStorage.sync === 'true');
		this.syncLabel = ko.computed(function() {
			return this.sync() ? 'ON' : 'OFF';
		}, this);
		
		// Parses loaded JSON data into the view model.
		parseData = function(data) {
			if (self.vmList().length) {
				// Load data into existing view model.
				$.each(self.vmList(), function(index, item) {
					item.refresh( data[index] );
				});
			} else {
				// Build view model from new data.
				data = $.map(data, function(item) { return new VMItem(item); });
				self.vmList( data );
			}
			
			if (self.sync()) {
				pending = setTimeout(loadData, 1000 * 60);
			}
		};
		
		// Requests new data from the server.
		loadData = function() {
			$.getJSON("vm.php"+reset, parseData);
			reset = ''; // Only request data reset upon initial load.
		};
		
		// Toggle control for auto-refresh setting.
		this.toggleSync = function() {
			self.sync( !self.sync() );
			localStorage.sync = self.sync();
			
			if (self.sync()) {
				loadData();
			} else {
				clearTimeout(pending);
			}
		};
		
		// load initial data.
		loadData();
	};
	
	// Apply Knockout bindings.
	ko.applyBindings(new VMList());
});
