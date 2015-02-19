var express = require('express');
var router = express.Router(); // returns a router instance which can be mounted
                              //  as a middleware
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var locations = {
  'First': 'First floor', 
  'Second': 'Second floor', 
  'Top': 'Penthouse'
};

router.route('/')
  .get(function(request, response) {
    if (request.query.limit >= 0) {
      response.json(locations.slice(0, request.query.limit));
    }
    response.json(Object.keys(locations));
  })
  .post(parseUrlencoded, function(request, response) {
    var newBlock = request.body;
    locations[newBlock.name] = newBlock.description;
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
    var description = locations[request.blockName];
    if (!description) {
      response.status(404).json('No description found for ' + request.params.name);
    }
    response.json(description);
  })
  .delete(function(request, response) {
    delete locations[request.blockName];
    response.sendStatus(200);
  });

module.exports = router;