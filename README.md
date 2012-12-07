#Virtual Machine Checkout

Small productivity app for tracking the usage status of shared virtual machines. To prevent usage conflicts, developers may sign out available VMs in their name, and then release their claims when finished. All checkouts are reset each night at midnight.

##Versions

- `prod/` : Full-featured production version of the VMCheckout app running on Threespot's app server. Built with [Knockout.js](http://knockoutjs.com/ "Knockout.js").
- `node` : Experimental builds of the app running on Node.js with a REST sever and a socket server.
- `mvc-demos/` : Demo builds of the basic app functionality, built using a variety of MV* frameworks. Includes:
	- [Angular.js](http://angularjs.org/ "Angular.js")
	- [Backbone.js](http://backbonejs.org/ "Backbone.js")
	- [Ember.js](http://emberjs.com/ "Ember.js")
	- [Knockout.js](http://knockoutjs.com/ "Knockout.js")
	- [Spine.js](http://spinejs.com/ "Spine.js")

Knockout was selected for the production version due to its convenient direct-UI bindings. Full-featured production app polls the server for updates, verifies new claims with the server to avoid out-of-sync UI conflicts, and offers a handy dispute resolution tool.

##Installation

1. Import `prod/vm.sql` into a new MySQL database. Default app config:
	- DB name: "vmcheckout"
	- user: "root"
	- pass: "root"
2. You should be up and running if you used the default app config. Otherwise, adjust the database connection info at the top of `prod/vm.php`.

