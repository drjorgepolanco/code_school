/*
 *
 * USER PARAMS
 * ===========
 * 
*/

// -----------------------------------------------------------------------------
/* 3.5 Massaging User Data
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

// -----------------------------------------------------------------------------
/* Same parameter used on multiple routes
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

// -----------------------------------------------------------------------------
/* Extracting duplication to app.param
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

// -----------------------------------------------------------------------------
/* Accessing custom properties on request
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

// -----------------------------------------------------------------------------
/* Accessing the Object keys
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

// -----------------------------------------------------------------------------
/* 3.6 Flexible Routes
 * ===================
 *
 * Our current route only works when the city name argument matches exactly the 
 * properties in the cities object. This is a problem. We need a way to make our 
 * code more flexible.
 * 
 * 1. Inside our route, call the parseCityName() function passing in the name 
 *    parameter. Assign the return value to the new variable called cityName.
 * 
 * 3. Now, using the city name returned from the parseCityName() function, lookup 
 *    the corresponding description using the cities object and store it in the 
 *    correct variable that will make the rest of the function work as intended.
 *
*/

var express = require('express');
var app     = express();

var cities  = {
  'Lotopia': 'Rough and mountainous',
  'Caspiana': 'Sky-top island',
  'Indigo': 'Vibrant and thriving',
  'Paradise': 'Lush, green plantation',
  'Flotilla': 'Bustling urban oasis'
}

app.get('/cities/:name', function(request, response) {
  var cityName = parseCityName(request.params.name);
  var cityInfo = cities[cityName];

  if (cityInfo) {
    response.json(cityInfo);
  }
  else {
    response.status(404).json('City not found');
  }
});

function parseCityName(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}

app.listen(3000);

// -----------------------------------------------------------------------------
/* 3.7 Dynamic Routes I
 * ====================
 *
 * Which Express function maps placeholders to callback functions, and is commonly 
 * used for running pre-conditions on Dynamic Routes?
 *
*/
app.param();

// -----------------------------------------------------------------------------
/* 3.8 Dynamic Routes II
 * =====================
 *
 * Whenever we use our name parameter we want to parse it a specific way. Let's 
 * clean up our existing code so that all routes with a name parameter get the 
 * same special handling.
 * 
 * 1. Call app.param() to intercept requests that contain an argument called  
 *    'name'. Remember app.param() takes a callback function as its second 
 *    argument, which uses the same signature as a middleware.
 *
 * 2. Inside the app.param() callback function, call the parseCityName() 
 *    function with the submitted name parameter. Set the return value to a new 
 *    property in the request object called cityName.
 *
 * 3. Finally, call a function that moves processing to the next function in the stack.
 *
*/

var express = require('express');
var app = express();

var cities = {
  'Lotopia': 'Rough and mountainous',
  'Caspiana': 'Sky-top island',
  'Indigo': 'Vibrant and thriving',
  'Paradise': 'Lush, green plantation',
  'Flotilla': 'Bustling urban oasis'
};

app.param('name', function(request, response, next) {
  request.cityName = parseCityName(request.params.name);
  next();
});

app.get('/cities/:name', function(request, response) {
  var cityInfo = cities[request.cityName];
  if (cityInfo) {
    response.json(cityInfo);
  } 
  else {
    response.status(404).json("City not found");
  }
});

function parseCityName(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}

app.listen(3000);                                                                                                                                                                                                                                                                                                            

// -----------------------------------------------------------------------------
/* 3.9 Dynamic Routes III
 * ======================
 *
 * The following code has a Dynamic Route that takes a year as an argument and 
 * returns the city created in that year. The problem with our current implementation  
 * is that it breaks when invalid data is sent on client requests. Let's add some 
 * basic validation.
 * 
 * 1. Call a function that intercepts Dynamic Routes with the 'year' param.
 *
 * 2. Inside of that function, use the isYearFormat() function to check whether 
 *    the year parameter is in a valid format. If so, then move processing to 
 *    the next function in the stack.
 *
 * 3. If the year parameter is not in a valid format, then respond with a 400 
 *    HTTP status code and a JSON message 'Invalid Format for Year'.
 *
*/

var express = require('express');
var app = express();

app.param('year', function(request, response, next) {
  if (isYearFormat(request.params.year)) {
    next();
  }
  else {
    response.status(400).json('Invalid Format for Year');
  }
});

var citiesYear = {
  5000: 'Lotopia',
  5100: 'Caspiana',
  5105: 'Indigo',
  6000: 'Paradise',
  7000: 'Flotilla'
};

function isYearFormat(value) {
  var regexp = RegExp(/^d{4}$/);
  return regexp.test(value);
}

app.get('/cities/year/:year', function(request, response) {
  var year = request.params.year;
  var city = citiesYear[year];

  if (!city) {
    response.status(404).json("No city found for given year");
  }
  else {
    response.json("In " + year + ", " + city + " is created.");
  }
});

app.listen(3000);

// -----------------------------------------------------------------------------
/* 3.10 Dynamic Routes IV
 * ======================
 *
 * With the proper validations in place for the following code, what would the 
 * output be for a GET request to /cities/year/500?
 *
*/

// --> 400 Invalid Format for Year
