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