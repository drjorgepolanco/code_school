/*
 * MIDDLEWARE
 * ==========
 * 
 * They provide for a more interactive experience on the web, allowing to update
 * certain parts of the page without doing a whole page refresh.
*/

/* 
 * Writing index.html
 * ------------------
 *
 * Place HTML files under the public folder
 * /public/html
*/
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Building Blocks</title>
</head>
<body>
  <h1>Blocks</h1>
</body>
</html>

/* 
 * Serving files with sendFile
 * ---------------------------
 *
 * Place HTML files under the public folder
 * /public/html
*/

var express = require('express');
var app = express();

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
}); //              --------- name of the currently executing script resides in

// Same as:
app.use(express.static('public')); // 'static' the only middleware shipped with express

app.listen(3000);

// -----------------------------------------------------------------------------
/* Executing Middleware Functions
 * ==============================
 *
 * When next() is called, processing moves to the next middleware
*/
app.use(function(request, response, next) {
  ...
  next(); // <-- moves processing to the next middleware
});

app.use(function(request, response, next) {
  ...
  response.send('done!'); // <-- We keep going until we want to send back a
                          //     response to the client, after 'response', no other mw will run
  next(); // <-- won't run
});

// -----------------------------------------------------------------------------
/* Reading the static Middleware source
 * ====================================
 *
 * The code for static() is a good example of Express Middleware
 *
 * https://github.com/expressjs/serve-static
*/
exports = module.exports = function serveStatic(root, options) {
  return function serveStatic(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next()
    }
    ...
    stream.pipe(res) // pipe it's content to the response object
  }
}

// -----------------------------------------------------------------------------
/* Making AJAX calls
 * =================
 *
 * Request to /blocks, then append results to block-list
*/

// client.js
$(function() {
  // Issues a request to the blocks endpoing and return blocks in JSON format
  // The result is passed as an argument to appendToList()
  $.get('/blocks', appendToList);
  function appendToList(blocks) {
    // Creates an empty array named list
    var list = [];
    // Iterates through each of the block and creates an <li> element for each
    // one with the text set to the block name
    for (var i in blocks) {
      // Finally we append our list to the page
      list.push($('<li>', { text: blocks[i] }));
    }
    $('.block-list').append(list);
  }
});


// app.js
// We create a new route for blocks
app.get('blocks', function(request, response) {
  var blocks = ['Fixed', 'Movable', 'Rotating'];
  response.json(blocks);
});

// -----------------------------------------------------------------------------
/* 2.4 Express Static
 * ==================
 * 
 * Change the code in app.js to use the express-static middleware instead of the 
 * response.sendFile() function.
 *
 * 1. Remove our app.get() containing the root '/' route.
 * 2. Mount the static middleware and serve files under the public directory.
*/

var express = require('express');
var app = express();

// app.get('/', function (request, response) {
//   response.sendFile(__dirname + '/public/index.html');
// });

app.use(express.static('public'));

app.get('/cities', function(req, res){
  var cities = ['Lotopia', 'Caspiana', 'Indigo'];
  res.send(cities);
});

app.listen(3001);

// -----------------------------------------------------------------------------
/* 2.5 Script Tags
 * ===============
 * 
 * Now we can add some client-side JavaScript by including the jquery.js and 
 * client.js files.
 *
 * 1. Within index.html, include jquery.js using a <script> tag.
 * 2. Within index.html, include client.js using a <script> tag.
 * 3. Now in the client.js file, complete the code for the $.get function so 
 *    that it calls the /cities URL path, and then runs the appendToList function.
*/

// public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cities</title>
</head>
<body>
  <h1>Cities</h1>

  <ul class='city-list'></ul>
  <script src="js/jquery.js"></script>
  <script src="js/client.js"></script>
</body>
</html>

// public/client.js
$(function() {
  $.get('/cities', appendToList);

  function appendToList(cities) {
    var list = [];
    for (var i in cities) {
      list.push($('<li>', { text: cities[i] }));
    }
    $('.city-list').append(list);
  }
});