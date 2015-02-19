/*
 * WRITING OUR OWN MIDDLEWARE
 * ==========================
 * 
 * Building a custom middleware
 * ----------------------------
 *
 * A logger which reports the duration for each request
*/

// logger.js
module.exports = function(request, response, next) {
  // Tracking the start time for the request
  var start = +new Date(); // + converts to miliseconds since Jan 1, 1970

  // Standard out is a writable stream which connects us to the process.stdout property
  var stream = process.stdout;

  // READING THE URL AND HTTP METHOD
  // The request object gives us the requested URL and the HTTP method used
  var url = request.url;
  var method = request.method; // We need them to built our logger message

  // The response object is an EventEmitter which we can use to listen to events
  response.on('finish', function() { // event handler function runs asynchronously
  // the finish event is emitted when the response has been handed of tho the OS

  var duration = +new Date() - start;
  var message = method + ' to ' + url + '\ntook ' + duration + ' ms \n\n';
  stream.write(message); // <-- prints the log message

  });

  next(); // moves the request to the next middleware
}

// app.js
var logger = require('./logger');
app.use(logger);

// ** Create a better logger using git: expressjs/morgan **


/*
 * 2.7 Logging Middleware
 * ======================
 * 
 * Help finish the following middleware code in the logger.js file:
 *
 * 1. On the response object, listen to the event that's emitted when the response 
 *    has been handed off from Express to the underlying Operating System.
 *
 * 2. Inside of the finish callback, calculate the duration of the request by 
 *    subtracting the startTime from a new Date object. Store the duration in the 
 *    duration variable, which has already been declared for you.
 *
 * 3. Using the stream object, which holds a reference to standard out, write the 
 *    following message: "This request took ____ ms", where ____ is the duration 
 *    for the request.
 *
 * 4. If we run the code as is, the request will be stuck in our middleware. 
 *    Call the function that moves processing to the next middleware in the stack.
*/

module.exports = function(request, response, next) {
  var startTime = +new Date();
  var stream = process.stdout;
  var duration = null;

  response.on('finish', function() {
    duration = +new Date() - startTime;
    stream.write("This request took " + duration + " ms");  
  });
  next();
};


/*
 * 2.9 Only GET
 * ============
 * 
 * Let's build a middleware that ensures only GET requests are allowed to go through.
 *
 * 1. First, in the only_get.js file, create an anonymous function that uses the 
 *    middleware signature and assign it to module.exports. Remember, the Express 
 *    middleware function signature takes three arguments.
 *
 * 2. Use the request object to check if the HTTP method used is 'GET' and if it 
 *    is, then call the function that moves processing to the next middleware in 
 *    the stack.
 *
 * 3. If the HTTP method is not 'GET', then complete the request by sending back 
 *    a message that says 'Method is not allowed'. 
*/

module.exports = function(request, response, next) {
  if (request.method === 'GET') {
    next();
  }
  else {
    response.send("Method is not allowed");
  }
};


/*
 * 2.10 Buildings
 * ==============
 * 
 * When we run the following code and issue a GET request to the /buildings 
 * endpoint, what will the response be?
 *
*/

var express = require('express');
var app = express();

app.use(function(request, response, next){
  if (request.path === "/cities"){
    next();
  } else {
    response.status(404).json("Path requested does not exist");
  }
});

app.get('/cities', function(request, response){
  var cities = ['Caspiana', 'Indigo', 'Paradise'];
  response.json(cities);
});

app.listen(3000);

// --> 404 "Path requested does not exist"





