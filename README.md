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

Knockout's direct UI bindings are well suited for the graphics of this app, therefore it was selected for the production version.