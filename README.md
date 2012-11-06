#Virtual Machine Checkout

Small productivity app for tracking the usage status of shared virtual machines. To prevent usage conflicts, a developer may open the VM-Checkout app, select an available VM from the list, and sign it out in their name. When finished, they may release their claim. All checkouts are reset each night at midnight.

##Versions

- `prod/` : Full-featured production version of the VM-Checkout app running on our Apps server. Built with [Knockout.js](http://knockoutjs.com/ "Knockout.js").
- `mvc-demos/` : Demo builds of the basic app functionality, built using a variety of MV* frameworks. Includes:
	- [Angular.js](http://angularjs.org/ "Angular.js")
	- [Backbone.js](http://backbonejs.org/ "Backbone.js")
	- [Ember.js](http://emberjs.com/ "Ember.js")
	- [Knockout.js](http://knockoutjs.com/ "Knockout.js")
	- [Spine.js](http://spinejs.com/ "Spine.js")

Knockout's direct UI bindings are well suited for the graphics of this app, therefore it was selected for the production version.