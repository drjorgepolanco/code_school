// -----------------------------------------------------------------------------
// Intro to Node.js
// ----------------

// // Hello Dog
var http = require('http'); // How we require modules

http.createServer(function(request, response) {
  response.writeHead(200);                 // Status code in header
  response.write('Hello, this is dog.');   // Response body
  response.end();                          // Close the connection
}).listen(8080);                           // Listen for connections on this port

console.log('Listening on port 8080...');


// Simulating a long running process
var http = require('http');

http.createServer(function(request, response) { // <-- request event
  response.writeHead(200);
  response.write("Dog is running.");
  setTimeout(function() {                       // <-- timeout event
    response.write("Dog is done.");
    response.end();
  }, 5000);
}).listen(8080);


// Blocking code
var contents = fs.readFileSync('/etc/hosts');
console.log(contents);
console.log('Doing something else');

// Non-Blocking code
fs.readFile('/etc/hosts', function(err, contents) {
  console.log(contents);
});
console.log('Doing something else');


// -----------------------------------------------------------------------------
// 1.3 Convert Blocking
// --------------------
/*
Not everyone knows why it's important to write non-blocking programs in Node.js. 
One of these unfortunate souls has written some code to read a file off the 
file-system using the blocking function readFileSync. Convert the code to be 
non-blocking using the readFile function instead.
*/
// var fs = require('fs');
// var contents = fs.readFileSync('index.html');
// console.log(contents);

var fs = require('fs');
fs.readFile('index.html', function(err, contents) {
  console.log(contents);
});


// -----------------------------------------------------------------------------
// 1.5 Read File in Server
// -----------------------
/*
Now that you know how to create an HTTP server and how to read a file off the 
filesystem in a non-blocking way, let's try to combine the two.

Instead of just writing a string to the HTTP response, write the contents of 
index.html to the response instead.
*/
// var http = require('http');
// var fs = require('fs');

// http.createServer(function(request, response) {
//   response.writeHead(200);
  
//   response.end();
// }).listen(8080);

var http = require('http');
var fs = require('fs');

http.createServer(function(request, response) {
  response.writeHead(200);
  var callback = function(err, contents) {
   response.write(contents);
   response.end();
  };
  fs.readFile('index.html', callback);
}).listen(8080);


// -----------------------------------------------------------------------------
// 1.7 Writing Response Headers
// ----------------------------
/*
Up until now all we've been sending into the response.writeHead() function is the 
status code. However, it can take additional parameters.
*/
// var http = require('http');
// var fs = require('fs');

// http.createServer(function(request, response) {
//   response.writeHead(200);

//   fs.readFile('index.html', function(err, contents) {
//     response.write(contents);
//     response.end();
//   });

// }).listen(8080);

var http = require('http');
var fs = require('fs');

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});

  fs.readFile('index.html', function(err, contents) {
    response.write(contents);
    response.end();
  });

}).listen(8080);


// -----------------------------------------------------------------------------
// 1.8 Response End
// ----------------
/*
Our original Hello server can be shortened since the response.end() function 
optionally takes data as a parameter. Remove the response.write line altogether, 
and send the hello string as a parameter on the response.end function. This will 
send the data, and once finished add the end to the response.
*/
// var http = require('http');

// http.createServer(function(request, response) {
//   response.writeHead(200);
//   response.write("Hello, this is dog");
//   response.end();
// }).listen(8080);

var http = require('http');

http.createServer(function(request, response) {
  response.writeHead(200);
  response.end("Hello, this is dog");
}).listen(8080);













