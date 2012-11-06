#Virtual Machine Checkout

Small productivity app for tracking the usage status of shared virtual machines. To prevent usage conflicts, a developer must open the VM-Checkout app, select an available VM from the list, and then sign it out in their name. When the developer is finished using the VM, they release the slot again.

##Versions

- `prod/` : Full-featured production version of the VM-Checkout app used on our Apps server. Built on Knockout.js.
- `mvc-demos/` : Demo builds of the basic app functionality, built using a variety of MV* frameworks. Includes:
	- Angular.js
	- Backbone.js
	- Ember.js
	- Knockout.js
	- Spine.js

Knockout's direct UI bindings are well suited for the graphics of this app, therefore it was selected for the production version.