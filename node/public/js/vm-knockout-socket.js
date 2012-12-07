// JSLint options:
/*global $, ko, VM */
/*jslint browser:true, white:true, vars:true */

/**
* VM Checkout
* @author Greg MacWilliam
* @require Knockout.js
* @require socket.io.js
*/
$(function() {
	"use strict";
	
	var socket;
	
	var VMRecord = function(data) {
		this.index = parseInt(data.id, 10);
		this.vm = data.vm;
		this.user = ko.observable(data.user);
		this.timestamp = ko.observable( Date.fromMysqlFormat(data.checkout) );
		
		this.isBusy = ko.computed(function() {
			return !!this.timestamp();
		}, this);
		
		this.actionLabel = ko.computed(function() {
			return this.isBusy() ? 'Vacate' : 'Claim';
		}, this);
		
		this.timestampLabel = ko.computed(function() {
			return !!this.timestamp() ? this.timestamp().toPrettyTime() : '';
		}, this);
	};
	
	VMRecord.prototype = {
		toggle: function() {
			if (this.isBusy()) {
				this.vacate();
			} else {
				this.claim();
			}
		},
		claim: function() {
			if (this.user().length) {
				this.timestamp( new Date() );
				this.save();
			}
		},
		vacate: function() {
			this.user('');
			this.timestamp(null);
			this.save();
		},
		save: function() {
			if (socket) {
				socket.emit('change', {
					id: this.index,
					user: this.user(),
					checkout: !!this.timestamp() ? this.timestamp().toMysqlFormat() : ''
				});
			}
		}
	};
	
	var VMList = function() {
		var self = this;
		
		self.vmList = ko.observableArray([]);
		
		socket = io.connect('/');
		
		socket.on('data', function(data) {
			// Map all items into VMRecords, and set them to the array.
			data = $.map(data, function(item) { return new VMRecord(item); });
			self.vmList(data);
		});
		
		socket.on('update', function(data) {
			// Find the updated record, and
			$.each(self.vmList(), function(index, item) {
				if (String(item.index) === String(data.id)) {
					item.user( data.user );
					item.timestamp( Date.fromMysqlFormat(data.checkout) );
					return;
				}
			});
		});
			
		socket.on('error', function() {
			socket.disconnect();
		});
	};

	ko.applyBindings( new VMList() );
});
