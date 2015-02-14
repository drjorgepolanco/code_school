// -----------------------------------------------------------------------------
// Level 4. Modules
// ----------------

// -----------------------
// Creating our own module
// -----------------------

// custom_hello.js
var hello = function () {
  console.log('hello!');
}

module.exports = hello;


// custom_goodbye.js
exports.goodbye = function () { // <-- 'exports' define what require returns
  console.log('bye!');
}

// app.js
var hello = require('./custom_hello');

var gb = require('./custom_goodbye');

hello();
gb.goodbye();

// If we only need to call once
require('./custom_goodbye').goodbye();


// -------------------------
// Export Multiple Functions
// -------------------------

// my_module.js
var foo = function () {}
var bar = function () {}
var baz = function () {}

exports.foo = foo;
exports.bar = bar;

// app.js
var myMod = require('./my_module');
myMod.foo();
myMod.bar();


// --------------------
// Making HTTP Requests
// --------------------

var http = require('http');

var message = "Here's looking at you, kid.";

var options = {
  host: 'localhost',
  port: 8080,
  path: '/',
  method: 'POST'
}
var request = http.request(options, function (response) {// <<-
  response.on('data', function (data) { //                     |
    console.log(data);  // logs response body                 |
  });                   //                                    |
});                     //                                    |
request.write(message); // begins request ------------------>>
request.end();          // finishes request


// --------------------------
// Encapsulating the function
// --------------------------

var http = require('http');

var message = "Here's looking at you, kid.";

var makeRequest = function (message) {
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/',
    method: 'POST'
  }
  var request = http.request(options, function (response) {
    response.on('data', function (data) {                  
      console.log(data);                 
    });                                                    
  });                                     
  request.write(message); 
  request.end();
}          
makeRequest("Here's looking at you, kid.");


// -------------------------
// Creating & Using a Module
// -------------------------

// make_request.js
var http = require('http');
var makeRequest = function (message) {
  ...
}

module.exports = makeRequest;

// app.js
var makeRequest = require('./make_request');

makeRequest("Here's looking at you, kid");
makeRequest("Hello, this is dog");


// --------------
// Require Search
// --------------

var make_request = require('./make_request');  // looks in the same directory
var make_request = require('../make_request'); // looks in parent directory
var make_request = require('/Users/eric/nodes/make_request'); // looks there 

// /Home/eric/my_app/app.js
var make_request = require('make_request'); // Search in node_modules directories

// if it doesn't find it, it will go searchin in the following order

// /Home/eric/my_app/node_modules/make_request.js
// /Home/eric/node_modules/make_request.js
// /Home/node_modules/make_request.js
// /node_modules/make_request.js


// -----------------------------------------------------------------------------
// 4.2 Missing Exports
// -------------------
/*
Notice the two different files: high_five.js on the left side and app.js on the 
right. The code as it's written will not work, high_five.js isn't exporting anything.
*/
var highfive = function () {
  console.log("smack!!");
};
// -->
module.exports = highfive;
// <--


// -----------------------------------------------------------------------------
// 4.3 Export A Function
// ---------------------
/*
Notice the app.js file with the myRequest function below. Let's refactor myRequest 
out to its own my_request.js module.

1. Move the myRequest function and the http require into my_request.js.
2. Export the myRequest function.
3. Require the my_request.js module in app.js.
*/

// my_request.js
var http = require('http');

var myRequest = function (message) {
  var request = http.request('http://codeschool.com', function (response) {
    response.pipe(process.stdout, { end: false });
  });

  request.write(message);
  request.end();
};

module.exports = myRequest;


// app.js
var myRequest = require('./my_request');

myRequest('Hello, this is dog.');


// -----------------------------------------------------------------------------
// 4.4 Exporting An Object
// -----------------------
/*
The app.js code on the right side does not work. Once again we forgot to export 
our functions.

1. In the logger.js file, export the info function so we can use it in app.js by 
   assigning it to the exports object.
2. In the logger.js file, export the warn function so we can use it in app.js by 
   assigning it to the exports object.
3. In the logger.js file, export the error function so we can use it in app.js by 
   assigning it to the exports object.
*/

// logger.js
var warn = function (message) {
  console.log("Warning: " + message);
};

var info = function (message) {
  console.log("Info: " + message);
};

var error = function (message) {
  console.log("Error: " + message);
};

exports.info = info;
exports.warn = warn;
exports.error = error;


// app.js
var logger = require('./logger');

logger.info('This is some information');
logger.warn('something bad is happening');


// -----------------------------------------------------------------------------
// 4.7 Dependency
// --------------
/*
Add two dependencies to our package.json file, connect and underscore. We'll want 
to use version 2.1.1 of connect and version 1.3.3 of underscore.

1. Add the connect dependency to package.json
2. Add the underscore dependency to package.json
*/

{
  "name": "My Awesome Node App",
  "version": "1",
  "dependencies": {
    "connect": "2.1.1",
    "underscore": "1.3.3"
  }
}


// -----------------------------------------------------------------------------
// 4.8 Semantic Versioning
// -----------------------
/*
We want to make sure we are always up-to-date with the most recent patch-level 
changes to our dependencies when we run npm install.

Update the connect version on package.json to fetch the latest patch-level changes. 
All we have to do is add one character to the beginning of the version number.
*/
{
  "name": "My Awesome Node App",
  "version": "1",
  "dependencies": {
    "connect": "~2.2.1",
    "underscore": "~1.3.3"
  }
}
