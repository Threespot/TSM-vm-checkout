#Virtual Machine Checkout

Small productivity app for tracking the usage status of shared virtual machines. To prevent usage conflicts, developers may sign out available VMs in their name, and then release their claims when finished. All checkouts are reset each night at midnight.

##Versions

- `prod/` : Full-featured production version of the VMCheckout app running on Threespot's app server. Built with [Knockout.js](http://knockoutjs.com/ "Knockout.js").
- `mvc-demos/` : Demo builds of the basic app functionality, built using a variety of MV* frameworks. Includes:
	- [Angular.js](http://angularjs.org/ "Angular.js")
	- [Backbone.js](http://backbonejs.org/ "Backbone.js")
	- [Ember.js](http://emberjs.com/ "Ember.js")
	- [Knockout.js](http://knockoutjs.com/ "Knockout.js")
	- [Spine.js](http://spinejs.com/ "Spine.js")

Knockout was selected for the production version for the convenience of its direct UI bindings.

##Installation

1. Import `prod/vm.sql` into a new MySQL. Application's default config:
	- DB Name: "vmcheckout"
	- User: "root"
	- Password: "root"
2. If you used the default application config, you should be up and running. Otherwise, adjust the database connection info at the top of `prod/vm.php`.

