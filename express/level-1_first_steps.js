/*
 *
 * Writing Hello World
 * ===================
 * 
 * Calling the express function gives us an application instance
 *
*/

var express = require('express');
var app = express();  // <-- application instance

// The app.get() creates a route that accepts GET requests

app.get('/', function(request, response) {
  response.send('Hello World');
});

app.listen(3000, function() {
  console.log("Listening on port %d", 3000);
});