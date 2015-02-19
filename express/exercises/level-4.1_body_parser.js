/*
 *
 * BODY PARSER
 * ===========
 * 
*/
// -----------------------------------------------------------------------------
/* 4.1 POST Requests
 * =================
 *
 * We are going to:
 * 
 * 1. Add a new form
 * 2. Create a POST route
 *
 * CLIENT --> POST to /blocks { name: "Flying", ------------------------> SERVER
 *                              description: "able to move through air" }
 *
 * CLIENT <--------------  201 Created "Flying" ------------------------< SERVER
 *              Returns a proper status code and a new Block name
*/


/* Adding a form to index.html
 * ---------------------------
 * Text field inputs will be needed for name and description
 * 
*/

// /public/index.html
<form>
  <legend>New Block</legend>
  <input name="name" placeholder="Name"><br>
  <input name="description" placeholder="Description"><br>
  <input type="submit">
</form>

// /public/js/client.js
$(function() {
  $.get('/blocks', appendToList);

  $('form').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var blockData = form.serialize(); // <-- transforms form data to URL-encoded 
                                     //      notation  --> ↴
    $.ajax({                        //        ↓            |
      type: 'POST', url: '/blocks', data: blockData // <-- ↲
    }).done(function(blockName) {
      appendToList([blockName]); // appendToList() expects an array of blocks
      form.trigger('reset');    // <-- cleans up form text input fields
    });
  });

  function appendToList(blocks) {
    var list = [];
    var content, block;
    for (var i in blocks) {
      block = blocks[i];
      content = '<a href="/blocks/' + block + '">' + block + '</a>';
      list.push($('<li>', { html: content }));
    }
    $('.block-list').append(list);
  }
});

// app.js
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false }); // ↰
//  forces the use Node's native   ----->   ↗ --------------- ↖ ---- ↗
//  query parser module: 'querystring'    ↗                     ↖  ↗
var blocks = { ... };

// Routes can take multiple handlers as arguments and will call them sequentially
app.post('/blocks', parseUrlencoded, function(request, response) {
  // Form submitted data can be accessed through request.body
  var newBlock = request.body; // <-- returns form data

  // The form elements are parsed to object properties, name and description
  blocks[newBlock.name] = newBlock.description; // <-- add new block to the blocks {}

  // The response includes proper status code and the block name
  response.status(201).json(newBlock.name);  // <-- responds with new block name
  //             ↖ sets the 201 created status code
});

/* Using multiple route handlers is useful for re-using middleware that load
   resources, perform validations, authentication, etc...                    


// -----------------------------------------------------------------------------
/* 4.2 Parser Setup
 * ================
 *
 * Assume the body-parser middleware is installed. Now, let's use it in our 
 * Express application.
 *
 * 1. Require the body-parser npm module and assign it to a variable called
 *    bodyParser. 
 *
 * 2. The body-parser middleware offers different parsing options. On the 
 *    bodyParser object, call a function that returns a parser for URL encoded 
 *    data and store it in a variable called parseUrlencoded. Remember to pass 
 *    in an option which forces the use of the native querystring Node library.
 *
 * 3. Mount the parser only in the post route.
 *
 * 4. Read the name and description parameters from the payload of the POST 
 *    request, and pass them as arguments to the createCity function (we've 
 *    created this one for you). Store the return value on the city variable.
 *
 * 5. Finally, respond back to the client with a 201 HTTP status code and the 
 *    value stored in city in JSON format using json.
*/

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

app.post('/cities', parseUrlencoded, function (request, response) {
  var city = createCity(request.body.name, request.body.description);
  response.status(201).json(city);
});

app.listen(3000);

var createCity = function(name, description){
  cities[name] = description;
  return name; 
};


// -----------------------------------------------------------------------------
/* 4.3 Validation
 * ==============
 *
 * The way that it is now, we are allowing new cities to be created with a blank 
 * description. Let's add some validation so that in order for a city to be created, 
 * its description must have a string length greater than 4.
 *
 * 1. Add an if block that checks for a description.length greater than 4, and 
 *    move our city creation logic into that block. Use json() to send the results 
 *    from createCity back to the client.
 *
 * 2. If description does not match its minimum length requirements, then set a 
 *    400 status code (Bad Request) to the response, and set the response body 
 *    to Invalid City using json().
 *
*/

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

app.post('/cities', parseUrlencoded, function(request, response) {
  var name = request.body.name;
  var description = request.body.description;
  if (description.length < 4) {
    response.status(400).json('Invalid city');
  }
  else {
    var city = createCity(name, description);
    response.status(201).json(city);
  }
});
app.listen(3000);


// -----------------------------------------------------------------------------
/* 4.4 DELETE Request
 * ==================
 *
 * We are going to:
 * 
 * 1. Add delete links
 * 2. Create DELETE route
 *
 * CLIENT --> DELETE to /blocks/Flying ---------------------------------> SERVER
 *
 * CLIENT <-------------------------  200 "OK" -------------------------< SERVER
 *              Returns a proper status code and "OK" response body
*/

/* 
 * Adding a DELETE link to the Blocks List
 * ---------------------------------------
 * Text field inputs will be needed for name and description
 * 
*/

// /public/client.js
$(function() {
  function appendToList(blocks) {
    var content, block;
    for (var i in blocks) {
      block = blocks[i];
      content = '<a href="/blocks/' + block + '">' + block + '</a>' +
      /* --> */ '<a href="#" data-block="' + block + '">❎</a>'; /* <-- */
      list.push($('<li>', { html: content }));
    }
    $('.block-list').append(list);

    $('.block-list').on('click', 'a[data-block', function(event) {
      if (!confirm('Are you sure?')) {
        return false;
      }
      var target = $(event.currentTarget);

      $.ajax({
        type: 'DELETE', url: '/blocks/' + target.data('block')
      }).done(function() {
        target.parents('li').remove();
      });
    });
  }
});

// app.js
app.delete('/blocks/:name', function(request, response) {
  delete blocks[request.blockName];
  // The sendStatus function sets both the status code and the response body
  response.sendStatus(200);
});



// -----------------------------------------------------------------------------
/* 4.6 DELETE Route
 * ================
 *
 * Create a Dynamic Route for deleting cities and handle for cities that are not 
 * in our list.
 *
 * 1. Create a DELETE route that takes the city name as its first argument, 
 *    followed by a callback that takes a request and response objects as arguments.
 *
 * 2. Use the built-in JavaScript operator delete (see MDN docs) to remove the 
 *    property for the city passed as an argument. Don't forget to use the attribute 
 *    set in app.param() to look the city up.
 *
 * 3. Use sendStatus() to respond back with a status code of 200.
 *
 * 4. Add an if block that checks whether the cityName provided from app.param() 
 *    has a valid entry before attempting to delete it from the cities object. 
 *    If a valid city is not found, then respond with a 404 HTTP status code using 
 *    the sendStatus() function.
*/
var express = require('express');
var app = express();

var cities = {
  'Lotopia': 'Rough and mountainous',
  'Caspiana': 'Sky-top island',
  'Indigo': 'Vibrant and thriving',
  'Paradise': 'Lush, green plantation',
  'Flotilla': 'Bustling urban oasis'
}

app.param('name', function(request, response, next) {
  request.cityName = parseCityName(request.params.name);
});

app.delete('/cities/:name', function(request, response) {
  if (cities[request.cityName]) {
    delete cities[request.cityName];
    response.sendStatus(200);
  }
  else {
    response.sendStatus(404);
  }
});

app.listen(3000);

function parseCityName(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}
