var express = require('express');
var app = express();

var logger = require('./logger');
app.use(logger);

app.use(express.static('public'));

var blocks = {
  'Fixed': 'Fastened securely in position',
  'Movable': 'Capable of being moved',
  'Rotating': 'Moving in a circle around its center'
};

var locations = {
  'First': 'First floor', 
  'Second': 'Second floor', 
  'Top': 'Penthouse'
};

// app.get('/blocks', function(request, response) {
//   var blocks = ['Fixed', 'Movable', 'Rotating'];
//   response.json(blocks);
// });

app.get('/blocks', function(request, response) {
  // var blocks = ["Fixed", "Movable", "Rotating"];
  if (request.query.limit >= 0) {
    response.json(blocks.slice(0, request.query.limit));
  }
  response.json(Object.keys(blocks));
});

app.get('/locations', function(request, response) {
  if (request.query.limit >= 0) {
    response.json(locations.slice(0, request.query.limit));
  }
  response.json(Object.keys(locations));
});

app.param('name', function(request, response, next) {
  var name = request.params.name;
  var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
  request.blockName = block;
  next();
});

app.get('/blocks/:name', function(request, response) {
  var description = blocks[request.blockName];
  if (!description) {
    response.status(404).json('No description found for ' + request.params.name);
  }
  response.json(description);
});

app.get('/locations/:name', function(request, response) {
  var location = locations[request.blockName];
  if (!location) {
    response.status(404).json('No location found for ' + request.params.name);
  }
  response.json(location);
});


app.listen(3000, function() {
  console.log("Listening on port %d", 3000);
});