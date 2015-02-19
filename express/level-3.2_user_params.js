/*
 *
 * USER PARAMS
 * ===========
 * 
*/

/*
 *
 * 3.5 Massaging User Data
 * =======================
 *
 * Normalizing the request parameter
 * ---------------------------------
 *
 * When one line does only one thing, it makes code easier to understand
 *
*/

// app.js
var expres = require('express');
var app = express();

var blocks = {
  'Fixed': 'Fastened securely in position',
  'Movable': 'Capable of being moved',
  'Rotating': 'Moving in a circle around its center'
};

app.get('/blocks/:name', function(request, response) {
  // var description = blocks[request.params.name];
  // response.json(description);

  var name = request.params.name;
  // Convert the first char to Uppercase and all the other to Lowercase.
  var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
  var description = blocks[block]; // block name is now in the same format as the
});                                // properties in the block object

app.listen(3000);

/*
 *
 * Same parameter used on multiple routes
 * --------------------------------------
 *
 * If we wanted to use the same parameter we would need to duplicate it:
 *
*/

var blocks = { ... };
var locations = {
  'Fixed': 'First floor', 'Movable': 'Second floor', 'Rotating': 'Penthouse'
};

app.get('/blocks/:name', function(request, response) {
  var name = request.params.name;
  var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
  ...
}); //                 ↑
    //            duplication
    //                 ↓
app.get('/locations/:name', function(request, response) {
  var name = request.params.name;
  var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
  ...
});

/*
 *
 * Extracting duplication to app.param
 * -----------------------------------
 *
 * The app.param function maps placeholders to callback functions.
 * It's useful for running pre-conditions on dynamic routes.
 *
*/

var blocks = { ... };
var locations = {
  'Fixed': 'First floor', 'Movable': 'Second floor', 'Rotating': 'Penthouse'
};

app.param('name', function(request, response, next) { // called for routes which 
  var name = request.params.name;                     // include the :name placeholder
  var blocks = name[0].toUpperCase() + name.slice(1).toLowerCase();

  // Setting properties on the request object
  // ----------------------------------------

  // Properties set on the request object can be accessed from all subsequent
  // routes in the application
  request.blockName = block;
  next();
});

/*
 *
 * Accessing custom properties on request
 * --------------------------------------
 *
 * We can read properties on request which were set on app.param
 *
*/
app.param('name', function(request, response, next) {
  ...
});

app.get('/blocks/:name', function(request, response) {
  var description = blocks[request.blockName];
}); //                 ↑
    //            much better
    //                 ↓
app.get('/locations/:name', function(request, response) {
  var location = locations[request.blockName];
})


/*
 *
 * Accessing the Object keys
 * -------------------------
 *
 * Object.keys(object)
*/

app.get('/blocks', function(request, response) {
  // var blocks = ["Fixed", "Movable", "Rotating"];
  if (request.query.limit >= 0) {
    response.json(blocks.slice(0, request.query.limit));
  }
  response.json(Object.keys(blocks)); // <-- That way we get the names, 
});                                   //     not the descriptions
