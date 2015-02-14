// -----------------------------------------------------------------------------
// Level 3. Streams
// ----------------

// Streams can be readable, writeable, or both.
// The API described here is for streams in Node v0.10.x a.k.a streams2

// Streaming Response

// The 'request' object is a 'readable' stream and the 'response' is writeable
// We read data from the request and write data to the response.

//                         readable
http.createServer(function (request, response){})
//                                   writeable

// How to READ from the request?

// * Remember: request is a Readable Stream and inherits from EventEmitter

// Let's print what we receive from the request:
http.createServer(function (request, response) {
  response.writeHead(200);
  request.on('readable', function () {
    var chunk = null;
    while(null !== (chunk = request.read())) { // if the request is not null
      // console.log(chunk.toString());
      response.write(chunk); // <--- response.write converts toString behind the scenes
    }
  });
  request.on('end', function () {
    response.end();
  });
}).listen(8080);

// When all we need to do is write on the stream as soon as we read, Node.js
// provide us with a helper method to do just that, so we can accomplish the exact
// same process with 'pipe'

// 'pipe' handles all event listening and chunk reading behind the scenes
// ------

http.createServer(function (request, response) {
  response.writeHead(200);
  request.pipe(response); // <-- this single line replaces all previous code!!
}).listen(8080);

// $ curl -d 'hello' http://localhost:8080  <-- from the client
// -> hello


// --------------------------
// Reading and Writing a File
// --------------------------

var fs = require('fs'); // require filesystem module

var file = fs.createReadStream('readme.md');
var newFile = fs.createWriteStream('readme_copy.md');

file.pipe(newFile);


// -------------
// Upload a File
// -------------

var fs = require('fs');
var http = require('http');

http.createServer(function (request, response) {
  var newFile = fs.createWriteStream('readme_copy.md');
  request.pipe(newFile);

  request.on('end', function () {
    response.end('uploaded!');
  });
}).listen(8080);

// $ curl --upload-file readme.md http://localhost:8080
// -> uploaded!


// -----------------------
// File Uploading Progress
// -----------------------

// $ curl --upload-file file.jpg http://localhost:8080 <-- our uploader

// Outputs                     We are going to need:
// progress: 3%                - HTTP Server
// progress: 43%               - File System
// ...
// progress: 91%
// progress: 100%

var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
  var newFile = fs.createWriteStream("readme_copy.md");
  // We need to know what the entire size of the file is:
  var fileBytes = request.headers['content-length'];
  var uploadedBytes = 0;
  request.on('readable', function () {
    var chunk = null;
    while(null !== (chunk = request.read())) {
      uploadedBytes += chunk.length;
      var progress = (uploadedBytes / fileBytes) * 100;
      response.write('progress: ' + parseInt(progress, 10) + "%\n");
    }
  });
  // We only keep using the reading to be able to track the progress, if not
  // 'pipe' would be doing the reading and writing for us
  request.pipe(newFile);
}).listen(8080);

console.log('Listening on port 8080...');


// -----------------------------------------------------------------------------
// 3.2 File Read Stream
// --------------------
/*
Use the fs module to create a Readable stream for fruits.txt. Store the new 
stream in a variable called file.

Next, listen to the readable event on the newly created stream and give it a 
callback.

Inside the callback, read the data chunks from the stream and print them to the 
console using console.log() - you might want to use a while loop to do this. 
Don't forget to call toString() on the data before printing it.
*/
var fs = require('fs');
var file = fs.createReadStream('fruits.txt');

file.on('readable', function () {
  var chunk = null;
  while(null !== (chunk = file.read())) {
    console.log(chunk.toString());
  }
});


// -----------------------------------------------------------------------------
// 3.3 File Piping
// ---------------
/*
Instead of manually listening for the 'readable' event on the Readable stream, 
let's use pipe to read from the stream and write directly to process.stdout.
*/
var fs = require('fs');
var file = fs.createReadStream('fruits.txt');

// file.on('readable', function(){
//   var chunk;
//   while(null !== (chunk = file.read())){
//     console.log(chunk.toString());
//   }
// });

file.pipe(process.stdout);


// -----------------------------------------------------------------------------
// 3.4 Fixing Pipe
// ---------------
/*
The following code will throw an error because pipe automatically closed our 
writable stream.

You'll need to consult the pipe documentation to figure out the option which 
keeps the Write stream open and dispatches the end event.
*/
var fs = require('fs');

var file = fs.createReadStream('origin.txt');
var destFile = fs.createWriteStream('destination.txt');

// file.pipe(destFile);
file.pipe(destFile, { end: false });

file.on('end', function () {
  destFile.end('Finished!');
});


// -----------------------------------------------------------------------------
// 3.5 Download Server
// -------------------
/*
Let's create an HTTP server that will serve index.html.

Use pipe() to send index.html to the response.
*/
var fs = require('fs');
var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});

  var file = fs.createReadStream('index.html');
  file.pipe(response);
  
}).listen(8080);
