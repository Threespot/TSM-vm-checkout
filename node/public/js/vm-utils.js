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
		if (timestamp && timestamp.indexOf('0000') < 0) {
			var regex = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/,
				parts = timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
			return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
		}
	    return null;
	};
}());

/**
* RETURN key binding for Knockout.
*/
ko.bindingHandlers.returnKey = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		ko.utils.registerEventHandler(element, 'keydown', function(evt) {
			if (evt.keyCode === 13) {
				evt.preventDefault();
				evt.target.blur();
				valueAccessor().call(viewModel);
			}
		});
    }
};