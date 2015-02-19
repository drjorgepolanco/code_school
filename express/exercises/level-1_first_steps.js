/*
 * FIRST STEPS
 * ===========
 * 
*/

// -----------------------------------------------------------------------------
/* Writing Hello World
 * ===================
 * 
 * Calling the express function gives us an application instance
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

// -----------------------------------------------------------------------------
/* The Request and Response Objects
 * ================================
 * 
 * Express extends Node HTTP objects
*/

// Express source code:

  // lib/request.js
var req = exports = module.exports = {
  __proto__: http.IncomingMessage.prototype // <----- ↰
};//  ↑                                               |
  //  |                                               |
  //  | ⇦--inheritance in JavaScript                  | 
  //  |                                               | Objects from Node HTTP
  //  |                                               |
  // lib/response.js                                  |
var res = module.exports = {               //         |
  __proto__: http.ServerResponse.prototype //  <----- ↲
};//  ↑

// -----------------------------------------------------------------------------
/* Calling Node's HTTP functions
 * =============================
 * 
 * Because express inherits from Node, we can call Node's functions from express
*/

var express = require('express');
var app = express();

app.get('/', function(request, response) {
  response.write('Hello World'); // write() and end() are
  response.end();                // both Node functions
});                              // We get the same response as with send()

app.listen(3000);

// -----------------------------------------------------------------------------
/* Responding with JSON
 * ====================
 * 
 * The send() function converts Objects and Arrays to JSON
*/

app.get('/blocks', function(request, response) {
  var blocks = ['Fixed', 'Movable', 'Rotating'];
  response.send(blocks);
});

/*
 * use -i to print response headers ------
 * $ curl -i http://localhost:3000/blocks ↲
 * 
 * HTTP/1.1 200 OK
 * X-Powered-By: Express
 * Content-Type: application/json; charset=utf-8 <-- Sets proper response header
 *
 * ["Fixed", "Movable", "Rotating"]
*/

// Better imprementation for Responding with JSON
app.get('/', function(request, response) {
  var blocks = ["Fixed", "Movable", "Rotating"];
  response.json(blocks); // Same as send(), for Objects and Arrays
});

// -----------------------------------------------------------------------------
/* Responding with HTML
 * ====================
 * 
 * The send() function converts Strings to HTML
*/

app.get('/', function(request, response) {
  var blocks = "<ul><li>Fixed</li><li>Movable</li><li>Rotating</li></ul>";
  response.send(blocks); // Same as send(), for Objects and Arrays
});

/*
 * $ curl -i http://localhost:3000/blocks
 * 
 * HTTP/1.1 200 OK
 * X-Powered-By: Express
 * Content-Type: text/html; charset=utf-8 <-- Proper response header
 *
 * <ul><li>Fixed</li><li>Movable</li><li>Rotating</li></ul> 
*/

// -----------------------------------------------------------------------------
/* Redirecting to Relative Path
 * ============================
 * 
 * The redirect() function sets the proper response headers
*/

app.get('/', function(request, response) {
  response.redirect('/parts'); // <-- Destination path '/parts'
});

/*
 * $ curl -i http://localhost:3000/blocks
 * 
 * HTTP/1.1 302 Moved Temporarily         <-- Status Code changed
 * X-Powered-By: Express
 * Content-Type: text/plain charset=utf-8 <-- Proper response header
 *
 * Moved Temporarily. Redirecting to /parts
*/

// -----------------------------------------------------------------------------
/* Redirecting with Custom Status: Permanent Redirect
 * ==================================================
 * 
 * The status code can be passed as the first argument to redirect
*/

app.get('/', function(request, response) {
  response.redirect(301, '/parts'); // <-- optional status code (301)
});

/*
 * $ curl -i http://localhost:3000/blocks
 * 
 * HTTP/1.1 301 Moved Permanently         <-- Status Code changed
 * X-Powered-By: Express
 * Content-Type: text/plain charset=utf-8 <-- Proper response header
 *
 * Moved Permanently. Redirecting to /parts
*/


















