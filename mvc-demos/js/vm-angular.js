// JSLint options:
/*global $, VM */
/*jslint browser:true, white:true, plusplus:true */

/**
* VM Checkout
* @author Greg MacWilliam
* @require angular.js
*/

/* Module boot-strapper... didn't end up needing this.
angular
	.module('vmcheckout', [])
	.filter('busyClass', function() {
		return function(busy) {
			return busy ? 'busy' : '';
		};
	});*/

function VMCheckout($scope, $http) {
	"use strict";
	
	$scope.isBusy = function(vm) {
		return !!vm.checkout && vm.checkout.indexOf('0000') < 0;
	};
	
	$scope.busyClass = function(vm) {
		return $scope.isBusy(vm) ? 'busy' : '';
	};
	
	$scope.altClass = function(vm) {
		return parseInt(vm.id, 10) % 2 > 0 ? 'alt' : '';
	};
	
	$scope.actionLabel = function(vm) {
		return $scope.isBusy(vm) ? 'Vacate' : 'Claim';
	};
	
	$scope.timestampLabel = function(vm) {
		return $scope.isBusy(vm) ? Date.fromMysqlFormat(vm.checkout).toPrettyTime() : '';
	};
	
	$scope.toggle = function(vm) {
		if ($scope.isBusy(vm)) {
			// Vacate
			vm.user = "";
			vm.checkout = "";
			$scope.save(vm);
			
		} else if (vm.user) {
			// Claim
			vm.checkout = new Date().toMysqlFormat();
			$scope.save(vm);
		}
	};
	
	$scope.save = function(vm) {
		$http.put(VM.dataPath, vm);
	};
	
	$http.get(VM.dataPath).success(function(data) {
		$scope.vmList = data;
	});
}
