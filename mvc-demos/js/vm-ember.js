// JSLint options:
/*global $, Ember, VM, VMCheckout */
/*jslint browser:true, white:true */

/**
* VM Checkout
* @author Greg MacWilliam
* @require jQuery.js
* @require Ember.js
*/
$(function() {
	"use strict";
	
	window.VMCheckout = Ember.Application.create();
	
	// Individual VM Records.
	VMCheckout.VMRecord = Ember.Object.extend({
		id: '',
		vm: '',
		user: '',
		timestamp: '',
		
		isAlt: Ember.computed(function() {
			return parseInt(this.get('id'), 10)%2 > 0;
		}).property('id'),
		
		isBusy: Ember.computed(function() {
			var timestamp = this.get('timestamp');
			return timestamp.length && timestamp.indexOf('0000') < 0;
		}).property('timestamp'),
		
		actionLabel: Ember.computed(function() {
			return this.get('isBusy') ? 'Vacate' : 'Claim';
		}).property('isBusy'),
		
		timestampLabel: Ember.computed(function() {
			return this.get('isBusy') ? Date.fromMysqlFormat( this.get('timestamp') ).toPrettyTime() : '';
		}).property('isBusy', 'timestamp'),
		
		save: function() {
			$.ajax({
				url: VM.dataPath,
				type: "put",
				data: JSON.stringify({
					id: this.get('id'),
					user: this.get('user'),
					checkout: this.get('timestamp')
				})
			});
		}
	});
	
	// VM List Controller.
	VMCheckout.vmList = Ember.ArrayController.create({
		content: [],
		init: function() {
			var self = this;
			
			$.getJSON(VM.dataPath, function(data) {
				
				data = $.map(data, function(item) {
					item.timestamp = item.checkout;
					return VMCheckout.VMRecord.create( item );
				});
				
				self.set('content', data);
			});
		},
		toggle: function(evt) {
			var record = evt.context;
			if (record.get('isBusy')) {
				// Vacate
				record.set('user', '');
				record.set('timestamp', '');
				record.save();
				
			} else if (record.get('user').length) {
				// Claim
				record.set('timestamp', new Date().toMysqlFormat());
				record.save();
			}
		}
	});
});
