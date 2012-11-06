// JSLint options:
/*global $, Spine, VM */
/*jslint browser:true, white:true, vars:true */

/**
* VM Checkout
* @author Greg MacWilliam
* @require jQuery.js
* @require spine.js
* @require ajax.js (spine)
*/
$(function() {
	"use strict";
	
	// VM item records.
	var VMRecord = Spine.Model.sub();
	VMRecord.configure("VMRecord", "id", "vm", "user", "checkout");
	VMRecord.extend(Spine.Model.Ajax);
	VMRecord.extend({url:VM.dataPath});
	VMRecord.include({
		isOdd: function() {
			return parseInt(this.id, 10) % 2 > 0;
		},
		isBusy: function() {
			return !!this.checkout && this.checkout.indexOf('0000') < 0;
		},
		timestampLabel: function() {
			return this.isBusy() ? Date.fromMysqlFormat( this.checkout ).toPrettyTime() : '';
		}
	});
	
	// VM list controller.
	var VMList = Spine.Controller.sub({
		el: $('#vm-list'),
		events: {
			"click button": "toggle"
		},
		init: function() {
			VMRecord.bind('refresh change', this.proxy(this.render));
			VMRecord.fetch();
		},
		render: function() {
			$("#vm-list")
				.empty()
				.append( $("#vm-tmpl").tmpl(VMRecord.all()) );
		},
		toggle: function(evt) {
			var li = $(evt.target).closest('li'),
				vm = VMRecord.find( li.data('id') ),
				user = li.find('input').val();

			if (vm.isBusy()) {
				// Vacate
				vm.user = "";
				vm.checkout = "";
				vm.save();
				
			} else if (user) {
				// Claim
				vm.user = user;
				vm.checkout = new Date().toMysqlFormat();
				vm.save();
			}
		}
	});

	window.vm = new VMList();
});
