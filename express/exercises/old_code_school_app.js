var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
// In memory store for the cities in our application
var cities = {};

var citiesRoute = app.route('/cities');

// GET route for /cities
app.get('/cities', function (request, response) {
  if(request.query.search) {
    response.json(citySearch(request.query.search));
  } else {
    response.json(cities);
  }
});

// POST route for /cities
app.post('/cities', parseUrlencoded, function (request, response) {
  if(request.body.description.length > 4) {
    var city = createCity(request.body.name, request.body.description);
    response.status(201).json(city);
  } else {
    response.status(400).json('Invalid City');
  }
});

// GET route for /cities/:name
app.get('/cities/:name', function (request, response) {
  var cityInfo = cities[request.cityName];
  if(cityInfo) {
    response.json(cityInfo);
  } else {
    response.status(404).json('City not found');
  }
});

// DELETE route for /cities/:name
app.delete('/cities/:name', function (request, response) {
  if(cities[request.cityName]) {
    delete cities[request.cityName];
    response.sendStatus(200);
  } else {
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