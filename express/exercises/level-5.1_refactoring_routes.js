/*
 *
 * REFACTORING ROUTES
 * ==================
 * 
*/

// -----------------------------------------------------------------------------
/* 5.1 Repetition in route names
 * =============================
 *
 * All routes seem to be handling requests to similar paths
 *
 * Using 'app.route()' is a recommended approach for avoiding duplicate route names
 *
*/

var express = require('express');
var app = express();

var blocksRoute = app.route('/blocks'); // returns route object which handles all
                                        // requests to the /blocks path

// Now we can avoid app.get('/blocks') and app.post('/blocks')
blocksRoute.get(function(request, response) { ... });

blocksRoute.post(parseUrlencoded, function(request, response) { ... });

...
app.listen(3000);


// Removing intermediate variables: Chaining functions
// -------------------------------  ==================

//  There's unnecessary repetition of the blocksRoute variable
app.route('/blocks')
  .get(function(request, response) {
    ...
  })
  .post(parseUrlencoded, function(request, response) {
    ...
  });

app.route('/blocks/:name')
  .get(function(request, response) {

  })
  .delete(function(request, response) {

  });

app.listen(3000);


// -----------------------------------------------------------------------------
/* 5.2 Route Instance
 * ==================
 *
 * Let's rewrite our cities routes using a Route Instance.
 *
 * 1. Create a new Route Instance for the '/cities' URL path and assign it to the 
 *    citiesRoute variable.
 *
 * 2. Move the code from our previous app.get() route to a new GET route on the 
 *    citiesRoute object.
 *
 * 3. Move app.post() to citiesRoute.
 *
 * 4. Now, let's get rid of the citiesRoute temporary variable and use chaining 
 *    function calls.
 *
*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
// In memory store for the cities in our application
var cities = {};

var citiesRoute = ;

app.route('/cities')
  // GET route for /cities
  .get(function (request, response) {
    if (request.query.search) {
      response.json(citySearch(request.query.search));
    } 
    else {
      response.json(cities);
    }
  })
  .post('/cities', parseUrlencoded, function (request, response) {
    if (request.body.description.length > 4) {
      var city = createCity(request.body.name, request.body.description);
      response.status(201).json(city);
    } else {
      response.status(400).json('Invalid City');
    }
  });

app.route('/cities/:name')
  // GET route for /cities/:name
  .get(function (request, response) {
    var cityInfo = cities[request.cityName];
    if (cityInfo) {
      response.json(cityInfo);
    } 
    else {
      response.status(404).json('City not found');
    }
  })
  // DELETE route for /cities/:name
  .delete(function (request, response) {
    if (cities[request.cityName]) {
      delete cities[request.cityName];
      response.sendStatus(200);
    } 
    else {
      response.sendStatus(404);
    }
  });

// Searches for keyword in description and returns the city
function citySearch(keyword) {
  var result = null;
  var search = RegExp(keyword, 'i');
  for(var city in cities) {
    if(search.test(cities[city])) {
      return city;
    }
  }
}

// Adds a new city to the in memory store
function createCity(name, description) {
  cities[name] = description;
  return name;
}

app.listen(3000);


// -----------------------------------------------------------------------------
/* 5.4 Route Files
 * ===============
 *
 * Extracting Routes to Modules
 * ----------------------------
 *
 * This helps clean up our code and allows our main app.js file to easily accomodate
 * aditional routes in the future
 *
 * All block-related logic is encapsulated inside its routes file
*/

// routes/blocks.js
var express = require('express');
var router = express.Router(); // returns a router instance which can be mounted
                              //  as a middleware
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var blocks = {
  'Fixed': 'Fastened securely in position',
  'Movable': 'Capable of being moved',
  'Rotating': 'Moving in a circle around its center'
};

router.route('/')
  .get(function(request, response) {
    if (request.query.limit >= 0) {
      response.json(blocks.slice(0, request.query.limit));
    }
    response.json(Object.keys(blocks));
  })
  .post(parseUrlencoded, function(request, response) {
    var newBlock = request.body;
    blocks[newBlock.name] = newBlock.description;
    response.status(201).json(newBlock.name);
  });

router.route('/:name')
  .all(function(request, response, next) {
    var name = request.params.name;
    var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
    request.blockName = block;
    next();
  })
  .get(function(request, response) {
    var description = blocks[request.blockName];
    if (!description) {
      response.status(404).json('No description found for ' + request.params.name);
    }
    response.json(description);
  })
  .delete(function(request, response) {
    delete blocks[request.blockName];
    response.sendStatus(200);
  });

module.exports = router;    //    exports the router as a Node module

// app.js
// Now ready to support multiple routes and still look clean
var express = require('express');
var app = express();

var logger = require('./logger');
app.use(logger);

app.use(express.static('public'));

var blocks = require('./routes/blocks');

app.use('/blocks', blocks);

app.listen(3000, function() {
  console.log("Listening on port %d", 3000);
});


// -----------------------------------------------------------------------------
/* 5.5 Using a Router Instance
 * ===========================
 *
 * Let's refactor app.js to use a Router object.
 * 
 * 1. Create a new router object and assign it to the router variable.
 * 
 * 2. When we are done, our router will be mounted on the /cities path. With 
 *    this in mind, change app.route('/cities') to use router and map requests 
 *    to the root path. 
 * 
 * 3. Likewise, let's move our '/cities/:name' route to our router. Remember to 
 *    update the path.
 * 
 * 4. Our router is now ready to be used by app. Mount our new router under the 
 *    /cities path.
 * 
*/

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

// In memory store for the cities in our application
var cities =  {
  'Lotopia': 'Rough and mountainous',
  'Caspiana': 'Sky-top island',
  'Indigo': 'Vibrant and thriving',
  'Paradise': 'Lush, green plantation',
  'Flotilla': 'Bustling urban oasis'
}

app.param('name', function(request, response, next) {
  request.cityName = parseCityName(request.params.name);
});

var router = express.Router();
router.route('/')
  .get(function(request, response) {
    if (request.query.search) {
      response.json(citySearch(request.query.search));
    }
    else {
      response.json(cities);
    }
  })
  .post(parseUrlencoded, function(request, response) {
    if (request.body.description.length > 4) {
      var city = createCity(request.body.name, request.body.description);
      response.status(201).json(city);
    }
    else {
      response.status(400).json('Invalid city');
    }
  });
router.route('/:name')
  .get(function(request, response) {
    var cityInfo = cities[request.cityName];
    if (cityInfo) {
      response.json(cityInfo);
    }
    else {
      response.status(404).json('City not found');
    }
  })
  .delete(function(request, response) {
    if (cities[request.cityName]) {
      delete cities[request.cityName];
      response.sendStatus(200);
    }
    else {
      response.sendStatus(404);
    }
  });

app.use('/cities', router);

// Searches for keyword in description and returns the city
function citySearch(keyword) {
  var regexp = RegExp(keyword, 'i');
  var result = cities.filter(function(city) {
    return city.match(regexp);
  });
  return result;
}

// Adds a new city to the in memory store
function createCity(name, description) {
  cities[name] = description;
  return name;
}

// Uppercase the city name
function parseCityName(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}

app.listen(3000);
