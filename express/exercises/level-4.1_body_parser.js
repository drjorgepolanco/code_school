
 *
 * BODY PARSER
 * ===========
 * 
*/

/*
 *
 * 4.1 POST Requests
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

/*
 *
 * Adding a form to index.html
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