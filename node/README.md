#VM-Checkout on Node.js

This build of the VM-Checkout app runs on Node.js, and may be run as a simple REST API or using live socket connections for real-time updates.

##Installation

 1. Make sure your database is set up (see root README).
 2. Install [Node.js](http://www.nodejs.org "Node.js").
 3. `cd` into VM-Checkout `node` directory.
 4. Run `npm install`.

##Running the App

The VM-Checkout Node server may be run in one of two ways. It may be run as a REST server, or as a socket server. It will run using REST by default.

Launch REST server:

`node index.js rest`

Launch socket server:

`node index.js socket`

After launching the server, VM-Checkout should be available at `http://localhost:8080`. Note that if you run one server version and then switch to the other, you'll probably need to clear your browser cache to see the new application version running.