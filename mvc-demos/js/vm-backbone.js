// JSLint options:
/*global $, _, Backbone, VM */
/*jslint browser:true, white:true, vars:true */

/**
* VM Checkout
* @author Greg MacWilliam
* @require jQuery / Zepto
* @require underscore.js
* @require backbone.js
*/
$(function() {
	"use strict";
	
	// Model
	var VMRecord = Backbone.Model.extend({
		defaults: function() {
			return {
				id: '',
				vm: '',
				user: '',
				checkout: ''
			};
		},
		isBusy: function() {
			var checkout = this.get('checkout');
			return !!checkout && checkout.indexOf('0000') < 0;
		},
		getViewModel: function() {
			var vm = this.toJSON();
			vm.odd = parseInt(vm.id, 10) % 2 > 0;
			vm.busy = this.isBusy();
			vm.timestamp = vm.busy ? Date.fromMysqlFormat( this.get('checkout') ).toPrettyTime() : '';
			return vm;
		}
	});
	
	// Model List
	var VMList = Backbone.Collection.extend({
		model: VMRecord,
		url: VM.dataPath,
		comparator: function(model) {
			return parseInt(model.get('id'), 10);
		}
	});
	
	// Application
	var VMApp = Backbone.View.extend({
		el: $("#vm-app"),
		events: {
			"click button":  "toggle"
		},
		initialize: function() {
			this.model = new VMList();
			this.model.on('reset change', this.render, this);
			this.model.fetch();
		},
		render: function() {
			var list = $('#vm-list').empty(),
				tmpl = _.template( $('#vm-item').html() );
			
			this.model.each(function(model) {
				list.append( tmpl(model.getViewModel()) );
			});
		},
		toggle: function(evt) {
			evt.preventDefault();
			
			var li = $(evt.target).closest('li'),
				vm = this.model.get( li.data('id') ),
				user = li.find('input').val();
				
			if (vm.isBusy()) {
				// Vacate
				vm.set('user', '');
				vm.set('checkout', '');
				vm.save();
				
			} else if (user) {
				// Claim
				vm.set('user', user);
				vm.set('checkout', new Date().toMysqlFormat());
				vm.save();
			}
		}
	});
	
	window.app = new VMApp();
});
