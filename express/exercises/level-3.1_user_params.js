/*
 *
 * USER PARAMS
 * ===========
 * 
*/

// -----------------------------------------------------------------------------
/* 3.1 Reading from the URL
 * ========================
 *
 * Limiting the number of Blocks returned
 * --------------------------------------
 * Query strings are a great way to limit the number of results returned from an 
 * endpoint
 *
*/

GET to /blocks
// -> ["Fixed", "Movable", "Rotating"]

GET to /blocks?limit=1
// -> ["Fixed"]

GET to /blocks?limit=2
// -> ["Fixed", "Movable"]

// -----------------------------------------------------------------------------
/* Limiting the number of Blocks returned
 * --------------------------------------
 * Use request.query to access query strings
 *
*/

// app.js
var express = require('express');
var app = express();

app.get('/blocks', function(request, response) {
  var blocks = ["Fixed", "Movable", "Rotating"];
  if (request.query.limit >= 0) {
    response.json(blocks.slice(0, request.query.limit));
  }
  response.json(blocks);
});

app.listen(3000);

/*
 * curl http://localhost:3000/blocks\?limit\=1
 * // -> ["Fixed"]%
 *
 * curl http://localhost:3000/blocks\?limit\=2
 * // -> ["Fixed","Movable"]%
 *
 * curl http://localhost:3000/blocks
 * // -> ["Fixed","Movable", "Rotating"]%
 *
*/ 

// -----------------------------------------------------------------------------
/* Dynamic Routes
 * ==============
 *
 * Placeholders can be used to name arguments part of the URL path
 *
 *
 * Returning description for a specific Block
 * ------------------------------------------
 * We can use meaningful URLs to return the description for specific types of 
 * Blocks
 *
 * Leveraging the power of URL paths
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
//    → --------------- ←
//  creates 'name' property on the request.params object -> request.params.name
  
  var description = blocks[request.params.name];
  response.json(description);
});

app.listen(3000);

// curl -i http://localhost:3000/blocks/Fixed

// -> HTTP/1.1 200 OK
//    X-Powered-By: Express
//    Content-Type: application/json; charset=utf-8
//    Content-Length: 31
//    ETag: W/"1f-52c691a1"
//    Date: Thu, 19 Feb 2015 10:43:40 GMT
//    Connection: keep-alive

//    "Fastened securely in position"%

// -----------------------------------------------------------------------------
/* Fixing the response for URLs not found
 * --------------------------------------
 * The status code does not indicate an invalid URL
 *
 * We must return a 404 Not Found status code and an informative error message
 * when a Block is not found
 *
*/

// $ curl -i http://localhost:3000/blocks/Banana

// Client >-> GET to /blocks/banana >-----------------> Server

//                        404 Not Found
// Client <-------------------------------------------< Server
//               "No description found for Banana"

//         Proper status code and custom error message

app.get('/blocks/:name', function(request, response) {
//    → --------------- ←
//  creates 'name' property on the request.params object -> request.params.name
  
  var description = blocks[request.params.name]; // returns 'undefined' when no
  if (!description) {                            // property is found
    response.status(404)
            .json('No description found for ' + request.params.name);
  }
  else {
    response.json(description);
  }
});

// -----------------------------------------------------------------------------
/* 3.2 City Seach
 * ==============
 *
 * We want to create an endpoint that we can use to filter cities. Follow the 
 * tasks below to to create this new route.
 *
 * 1. Create a new route for GET requests to '/cities'. The second argument 
 *    should be a callback function which takes request and response.
 *
 * 2. From inside of our route, create an if statement that checks whether a 
 *    value is set to the query string parameter search.
 *
 * 3. Inside of the if block, call the citySearch() function, passing in the 
 *    user submitted parameter for search. Then return the result of the function 
 *    as a JSON response.
 *
*/

var express = require('express');
var app = express();

var cities = ["Caspiana", "Indigo", "Paradise"];

app.get('/cities', function(request, response) {
  if (request.query.search) {
    response.json(citySearch(request.query.search));
  }
});

function citySearch(keyword) {
  var regexp = RegExp(keyword, 'i');
  var result = cities.filter(function(city) {
    return city.match(regexp);
  });
  return result;
}
app.listen(3000);

// -----------------------------------------------------------------------------
/* 3.4 City Information
 * ====================
 *
 * Now lets look up some information about the city.
 *
 * 1. Inside of our dynamic route, grab the name submitted by the user, lookup 
 *    the city information on the cities object and assign it to the cityInfo 
 *    variable.
 *
 * 2. Check to see if cityInfo exists and if so, respond with the cityInfo in 
 *    JSON format.
 *
 * 3. If cityInfo does not exist, respond with a 404 HTTP status code and a JSON 
 *    message that says "City not found".
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

app.get('/cities/:name', function(request, response) {
  var cityInfo = cities[request.params.name];
  if (cityInfo) {
    response.json(cityInfo);
  }
  else {
    response.status(404).json('City not found');
  }
});

app.listen(3000);
