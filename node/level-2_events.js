// -----------------------------------------------------------------------------
// Level 2. Events
// ---------------

// Events in Node: many objects in Node emit Events

// EventEmitter
// |                   emit
// |-->  net.Server    ----> 'request' event // <--|
// |                   emit                  //    | both inherit from 'EventEmitter'
// |-->  fs.readStream ----> 'data'    event // <--|


// Custom Event Emitters
var EventEmitter = require('events').EventEmitter;

var logger = new EventEmitter();

//* We want logger to emit 'error' events, 'warn' events and 'info' events
//* We want to be able to write 'listeners' so we can listen when those events occur

// Listening for 'error' event:
logger.on('error', function(message) {
  console.log('ERR: ' + message);
});

// To trigger the 'error' event
logger.emit('error', 'Spilled Milk');  // -> ERR: Spilled Milk
logger.emit('error', 'Eggs Cracked');  // -> ERR: Eggs Cracked


// ----------------
// Breaking it Down
// ----------------

http.createServer(function(request, response) { ... });
//                                               |
http.createServer([requestListener]) //           <<----------------------------------------<<
// Returns a new web server object                                                            |
// The 'requestListener' is a function which is automatically added to the >'request'< event  |
//                                                                              |             |
Class: http.Server //                                                           |             |
// This is an EventEmitter with the following events:                           |             |
//                                                                              |             |
  Event: 'request' // <<------------------------------------------------------<<              |
  function(request, response) {} // >>------------------------------------------------------>>
  // Emitted each time there is a request


// Alternate Syntax
// ----------------
var server = http.createServer();
server.on('request', function(request, response) { ... });
// This way is how you actually add event listeners in Node.js but they are both the same

// You can listen to multiple events in an object or you can have multiple functions
// that listen to the same event.


  Event: 'close'
  function() {}
  // Emitted when the server closes.

  server.on('close', function() { ... });


// -----------------------------------------------------------------------------
// 2.2 Chat Emitter
// ----------------

// Create a new EventEmitter object and assign it to a variable called 'chat'.

var events = require('events');
var EventEmitter = events.EventEmitter;
var chat = new EventEmitter();

// Next, let's listen for the 'message' event on our new chat object. Remember 
// to add a callback that accepts the message parameter.

// Log the message to the console using console.log().

chat.on('message', function(message) {
  console.log(message);
});


// -----------------------------------------------------------------------------
// 2.3 Emitting Events
// -------------------

// On the chat object, emit the 'join' event and pass in a custom message as a string.
var events = require('events');
var EventEmitter = events.EventEmitter;

var chat = new EventEmitter();
var users = [], chatlog = [];

chat.on('message', function(message) {
  chatlog.push(message);
});

chat.on('join', function(nickname) {
  users.push(nickname);
});

// Emit events here
chat.emit('join', "Jorge");

// Now emit the 'message' event on the chat object. Just like before, remember 
// to pass in a custom message as a string.
chat.emit('message', "This is the Remix!");


// -----------------------------------------------------------------------------
// 2.4 Request Event
// -----------------
/*
Add an event listener on the server variable that listens to the request event. 
The event listener should take a callback function with two arguments, request 
and response.

Move the logic for handling the request from the http.createServer() callback to 
your new 'request' event listener. 

Remember to remove the http.createServer() callback once the code has been moved.
*/
var http = require('http');

var server = http.createServer(/*function(request, response) {
  response.writeHead(200);
  response.write("Hello, this is dog");
  response.end();
}*/);

server.listen(8080);
// Your code goes here
server.on('request', function(request, response) {
  response.writeHead(200);
  response.write("Hello, this is dog");
  response.end();
});


// -----------------------------------------------------------------------------
// 2.5 Listening Twice
// -------------------
/*
Add a second 'request' handler to the HTTP server.

From inside of the new handler, log the message "New request coming in..." 
using console.log().
*/

var http = require('http');

var server = http.createServer();
server.on('request', function(request, response) {
  response.writeHead(200);
  response.write("Hello, this is dog");
  response.end();
});
// -->
server.on('request', function(request, response) {
  console.log("New request coming in...");
});
// <--
server.listen(8080);


// -----------------------------------------------------------------------------
// 2.6 Listening for Close
// -----------------------
/*
Listen for the 'close' event on the server. The event listener should take a 
callback function that accepts no arguments.

Inside the 'close' callback, log the message "Closing down the server...".
*/

var http = require('http');
var server = http.createServer();

server.on('request', function(request, response) {
  response.writeHead(200);
  response.write("Hello, this is dog");
  response.end();
});

server.on('request', function(request, response) {
  console.log("New request coming in...");
});

// -->
server.on('close', function() {
  console.log("Closing down the server...");
});
// <--

server.listen(8080);

























