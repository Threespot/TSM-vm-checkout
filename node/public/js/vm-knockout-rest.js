// JSLint options:
/*global $, ko, VM */
/*jslint browser:true, white:true, vars:true */

/**
* VM Checkout
* @author Greg MacWilliam
* @require Knockout.js
* @require Zepto.js
*/
$(function() {
	"use strict";

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
			$.ajax({
				url: '/api/'+this.index,
				type: 'post',
				data: {
					id: this.index,
					user: this.user(),
					checkout: !!this.timestamp() ? this.timestamp().toMysqlFormat() : ''
				}
			});
		}
	};
	
	var VMList = function() {
		var self = this;
		
		self.vmList = ko.observableArray([]);
		
		$.getJSON('/api', function(data) {
			// Map all items into VMRecords, and set them to the array.
			data = $.map(data, function(item) { return new VMRecord(item); });
			self.vmList(data);
		});
	};

	ko.applyBindings( new VMList() );
});
