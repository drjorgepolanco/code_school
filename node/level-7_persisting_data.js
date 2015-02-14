// -----------------------------------------------------------------------------
// Level 7. Persisting Data
// ------------------------

// Old code (Without persistence)
io.sockets.on('connection', function (client) {
  client.on('join', function (name) {
    client.set('nickname', name);
    client.broadcast.emit('chat', name + ' joined the chat');
  });
  client.on('messages', function (message) {
    client.get('nickname', function (error, name) {
      client.broadcast.emit('messages', name + ': ' + message);
      client.emit('messages', name + ': ' + message);
    });
  });
});


// Storing Messages
var messages = []; // store messages in array

var storeMessage = function (name, data) {
  messages.push({ name: name, data: data }); // add message to end of array
  if (messages.length > 10) {
    messages.shift(); // if more than 10 msgs long, remove the first one
  }
}

// Emitting Messages
io.sockets.on('connection', function (client) {
  ...
  client.on('join', function (name) {
    messages.forEach(function (message) {
      client.emit('messages', message.name + ': ' + message.data);
    }); // iterate through 'messages' array and emit a message on the 
  });   // connecting client for each one.


  client.on('messages', function (message) {
    client.get('nickname', function (error, name) {
      client.broadcast.emit('messages', name + ': ' + message);
      client.emit('messages', name + ': ' + message);
      storeMessage(name, message); // when client sends a msg, call storeMessage()
    });
  });
});


// -----------------------------------------------------------------------------
// Persisting Data: REDIS
// ----------------------

// ---------------------
// REDIS Data Structures
// ---------------------
/*
    data structure   | commands
    -----------------|----------------------------------------
    Strings          | SET,   GET,  APPEND, DECR,     INCR
    Hashes           | HSET,  HGET, HDEL,   HGETALL
    Lists            | LPUSH, LREM, LTRIM,  RPOP,     LINSERT
    Sets             | SADD,  SREM, SMOVE,  SMEMBERS
    Sorted Sets      | ZADD,  ZREM, ZSCORE, ZRANK
*/

// To connect our node app with Redis we'll use the node_redis library
// Github:  mranney/node_redis
// Install: $ npm install redis --save

var redis = require('redis');
var client = redis.createClient();

//            key                value
//         ---------   ------------------------
client.set('message1', 'hello, yes this is dog');
client.set('message2', 'hello, no this is spider');


// To get the messages out of the database:
client.get('message1', function (error, reply) {
  console.log(reply); // -> "hello, yes this is dog"
});

// --------------------
// REDIS Lists: Pushing
// --------------------

// Add a string to the 'messages' list
var message = "Hello, this is dog";
client.lpush('messages', message, function (error, reply) {
  console.log(reply); // -> '1' --> replies with list length
});

// Add another string to 'messages'
var message = "Hello, no this is spider";
client.lpush('messages', message, function (error, reply) {
  console.log(reply) // -> '2'
});

// -----------------------
// REDIS Lists: Retrieving
// -----------------------

// Using LPUSH & LTRIM
var message = "Hello, this is dog";
client.lpush('messages', message, function (error, reply) {
  client.ltrim('messages', 0, 1); 
}); // trim keeps first 2 strings (0, 1) and removes the rest

// Retrieving from list
client.lrange('messages', 0, -1, function (error, messages) {
  console.log(messages);
}); // replies with all strings in list (from index 0 to index -1)
    // -> ['hello, yes this is dog', 'hello, no this is spider']


// ----------------------------
// Converting Messages to Redis
// ----------------------------

// We need to update our storeMessage function to use Redis

// Let's use the List data-structure

var redisClient = redis.createClient();

var storeMessage = function (name, data) {
  var message = JSON.stringify({ // need to turn object into string to store in redis
    name: name, 
    data: data 
  });

  redisClient.lpush('messages', message, function (error, response) {
    redisClient.ltrim('messages', 0, 9); // keeps the newest 10 items
  });
}

// Output from List

// Before we had
client.on('join', function (name) {
  messages.forEach(function (message) {
    client.emit('messages', message.name + ': ' + message.data);
  });
});

// To use Redis
client.on('join', function (name) {
  // Fetch all list items with lrange
  redisClient.lrange('messages', 0, -1, function (error, messages) {
    // reverse messages to emit it in the correct order
    messages = messages.reverse();
    // iterate through each message that is returned in that list
    messages.forEach(function (message) {
      // first, parsing the string that gets returned into a JSON objects
      message = JSON.parse(message);
      // finally, emiting that to the client
      client.emit("messages", message.name + ": " + message.data);
    });
  });
});

// --------------------
// Current Chatter List
// --------------------

// 'Sets' are lists of unique data, you can't have duplicates

// let's show the people that are currently connected

// add members of the names set
client.sadd('names', 'Dog');
client.sadd('names', 'Spider');
client.sadd('names', 'Gregg');

// remove members of the names set
client.srem('names', 'Spider');

// list all members of the set
client.smembers('names', function (err, names) {
  console.log(names); // -> ["Dog", "Gregg"]
});

// ---------------
// Adding Chatters
// ---------------

// app.js
client.on('join', function (name) {
  // notify other clients a chatter has joined
  client.broadcast.emit('add chatter', name);
  // add this chatter to our Redis set
  redisClient.sadd('chatters', name);
});

// index.html
socket.on('add chatter', function (name) {
  var chatter = $('<li>' + name + '</li>').data('name', name);
  $('#chatters').append(chatter);
});


//  What if there are already 'chatters' in the chatroom?
// (What if there are users in our set?)

// ---------------
// Adding Chatters (cont)
// ---------------

// app.js
client.on('join', function (name) {
  client.broadcast.emit('add chatter', name);

  redisClient.sadd('chatters', name);
  // list all the people on the set
  redisClient.smembers('names', function (err, names) {
    // iterate through each of the names
    names.forEach(function (name) {
      client.emit('add chatter', name);
    }); // emit all the currently logged in chatters to 
  })    // the newly connected client

  redisClient.sadd('chatters', name);
});

// -----------------
// Removing Chatters (When the websocket disconnect)
// -----------------

// app.js

// on the 'disconnect' event:
client.on('disconnect', function (name) {
  // 1. get their current nickname
  client.get('nickname', function (err, name) {
    // 2. broadcast the 'remove chatter' event to all of our other clients
    client.broadcast.emit('remove chatter', name);

    // 3. remove them from our Redis Set
    redisClient.srem('chatters', name);
  });
});


// index.html

// listen for the 'remove chatter' event
server.on('remove chatter', function (name) {
  // remove it with jQuery
  $('#chatters li[data-name=' + name + ']').remove();
});


// -----------------------------------------------------------------------------
// 7.2 Simple Redis Commands
// -------------------------
/*
Let's start practicing using the redis key-value store from our node application.

1. Require the redis module and assign it to a variable called redis.

2. Create a redis client and assign it to a variable called client.

3. On the client, set the name property to your name.
*/
var redis = require('redis');
var client = redis.createClient();
client.set('name', 'Jorge');


// -----------------------------------------------------------------------------
// 7.3 Get A Key
// -------------
/*
We have already stored a value in the question key. Use the redis client to issue 
a get command to redis to retrieve and then log the value.

1. Use the redis client to issue a get command using the 'question' key to retrieve 
   a value. Remember, the get function takes a callback which expects two arguments, 
   error and data.

2. Log the value retrieved with console.log.
*/
var redis = require('redis');
var client = redis.createClient();

client.get('question', function (err, data) {
  console.log(data);
}); 


// -----------------------------------------------------------------------------
// 7.4 Working With Lists 1
// ------------------------
/*
As we saw in the video, redis can do more than just simple key-value pairs. We 
are going to be using redis' LISTS later to add persistence to our live-moderation 
app, so let's practice using them now.

1. Using the redis client's lpush command, insert question1 into the questions 
   list. Then, console.log the result you receive. Remember, the lpush function 
   takes a callback as its last argument, which expects and error and value to 
   be passed as arguments.

2. Using the redis client's lpush command, insert question2 into the questions 
   list. Then console.log the result you receive.
*/
var redis = require('redis');
var client = redis.createClient();

var question1 = "Where is the dog?";
var question2 = "Where is the cat?";

client.lpush('questions', question1, function (error, value) {
  console.log(value);
});

client.lpush('questions', question2, function (error, value) {
  console.log(value);
});


// -----------------------------------------------------------------------------
// 7.5 Working With Lists 2 
// ------------------------
/*
Now that we have seeded the questions list, use the lrange() command to return 
all of the items and log them.

1. Use the lrange() command to return all of the items from the questions key.

2. Now that we have called lrange(), use console.log to log the result from redis.
*/
var redis = require('redis');
var client = redis.createClient();

client.lrange('questions', 0, -1, function (error, questions) {
  console.log(questions);
});


// -----------------------------------------------------------------------------
// 7.6 Persisting Questions 
// ------------------------
/*
Let's go back to our live-moderation app and add some persistence, first to the 
questions people ask.

1. Use the lpush command to add new questions to the list named questions. Do 
   this inside the listener for the 'question' event.
*/
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io');
var io = socket.listen(server);

var redis = require('redis');
var redisClient = redis.createClient();

io.sockets.on('connection', function (client) {
  client.on('answer', function (question, answer) {
    client.broadcast.emit('answer', question, answer);
  });

  client.on('question', function (question) {
    if(!client.question_asked) {
      client.question_asked = true;
      client.broadcast.emit('question', question);
      // add the question to the list here
      redisClient.lpush('questions', question);
    }
  });
});
 

// -----------------------------------------------------------------------------
// 7.7 Emitting Stored Questions 
// -----------------------------
/*
Now that we have questions stored in redis, let's emit them whenever a new client 
connects to the server through socket.io.

1. Use the lrange command to retrieve a list of questions that represent the 
   questions list within redis.

2. Inside of the lrange callback, use a forEach loop to iterate through the 
   questions and emit() each question to the client. Remember, don't use 
   broadcast.emit because we only want to send the questions to the client 
   that is connecting to the server.
*/
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var redis = require('redis');
var redisClient = redis.createClient();

io.sockets.on('connection', function (client) {
  // -->
  redisClient.lrange('questions', 0, -1, function (error, questions) {
    questions.forEach(function (question) {
      client.emit('question', question);
    });
  });
  // <--

  client.on('answer', function (question, answer) {
    client.broadcast.emit('answer', question, answer);
  });

  client.on('questions', function (question) {
    if (!client.question_asked) {
      client.question_asked = true;
      client.broadcast.emit('question', question);
      redisClient.lpush('questions', question);
    }
  });
});


// -----------------------------------------------------------------------------
// 7.8 Limiting Questions Stored 
// -----------------------------
/*
Great work! One last thing though, since every time a new question comes in we 
store it in the questions list, we might run into a problem where there are just 
too many questions stored in that list.

1. Add a callback to lpush that will be used to limit the size of the list down 
   to a max of 20.

2. Use the ltrim command to limit the size of the list stored within redis to a 
   maximum size of 20.
*/
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var redis = require('redis');
var redisClient = redis.createClient();

io.sockets.on('connection', function (client) {

  redisClient.lrange('questions', 0, -1, function (err, questions) {
    questions.forEach(function (question) {
      client.emit('question', question);
    });
  });

  client.on('answer', function (question, answer) {
    client.broadcast.emit('answer', question, answer);
  });

  client.on('question', function (question) {
    if (!client.question_asked) {
      client.question_asked = true;
      client.broadcast.emit('question', question);
      redisClient.lpush('questions', question, function () {
        redisClient.ltrim('questions', 0, 19);
      });
    }
  });
});
