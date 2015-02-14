// -----------------------------------------------------------------------------
// Level 6. Socket.io
// ------------------

// Websockets

// $ npm install --save socket.io

// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Now Socket.io and Express are sharing the same http server.

io.on('connection', function (client) {
  console.log('Client connected...');

// --------------------------
// Sending Messages to Server
// --------------------------

  client.on('messages', function (data) {
    console.log(data); // listen for 'messages' event

    // Broadcasting Messages
    client.broadcast.emit("messages", data); 
    // broadcast msg to all other clients connected
  });

// --------------------------
// Sending Messages to Client
// --------------------------

  // emit the 'messages' event on the client
  client.emit('messages', { hello: 'world' }); // * 1
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8080);


// socket.io client connects to the server

// index.html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost:8080');

  $('#chat_form').submit(function (e) {
    var message = $('#chat_input').val();
    // emit the 'messages' event on the server
    socket.emit('messages', message);
  });

  socket.on('messages', function (data) {
    alert(data.hello); // * 1
  });

  socket.on('messages', function (data) {
    insertMessage(data); // Insert message into the chat
  });
</script>

// -------------------------
// Saving Data on the Socket
// -------------------------

// Creating a 'join' event

// app.js
io.on('connection', function (client) {
  client.on('join', function (name) {
    client.nickname = name; // This will be available on the server and the client
    // Set the nickname associated with this client
  });
});

// index.html
<script>
  var server = io.connect('http://localhost:8080');
  server.on('connect', function (data) {
    // Just to know we are connected
    $('#status').html('Connected to chattr');
    // Prompt the user to get his name
    nickname = prompt('What is your nickname');
    // Take that value and emit that join event sending it back to the server
    server.emit('join', nickname); // Notify the server of the user's nickname
  });
</script>

// -------------------------
// Saving Data on the Client
// -------------------------

// app.js
io.on('connection', function (client) {
  client.on('join', function (name) {
    client.nickname = name; // set the nickname associated with this client
  });

  client.on('messages', function (data) {

    // before we broadcast the message, we get the nickname of the client
    var nickname = client.nickname; // get the nickname of client before broadcast
    // once we retrieve the nickname, we'll have a callback which will then
    // broadcast our message with our username.

    client.broadcast.emit('message', nickname + ": " + message);
    // broadcast with the name and message

    client.emit('messages', nickname + ": " + message);
    // send the same message back to our client, so we can see what we wrote.
  });
});


// -----------------------------------------------------------------------------
// 6.2 Setting Up socket.io Server-Side
// ------------------------------------
/*
So far we've created an Express server. Now we want to start building a real-time 
Q&A moderation service and we've decided to use socket.io.

1. Using the http module, create an new http server and pass the express app as 
   the listener for that new server.
2. Using the socket.io module, listen for requests on the http server. Store the 
   return object of this operation in a variable called io.
3. Use the object stored in io to listen for client 'connection' events. Remember, 
   the callback function takes one argument, which is the client object that has 
   connected.
4. When a new client connects, log a message using console.log().

5. Finally, we want to tell our http server to listen to requests on port 8080.
*/
var express = require('express');
var app = express();
// -->
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// <--

io.on('connection', function (client) {
  console.log('Connected...');
});

server.listen(8080);


// -----------------------------------------------------------------------------
// 6.3 Client socket.io Setup
// --------------------------
/*
In our html file, load the socket.io.js script and connect to the socket.io server.

1. Load the socket.io.js script. The socket.io.js path you should use is 
   '/socket.io/socket.io.js'. Express knows to serve the socket.io client 
   js for this path.

2. Using the global io object that's now available for us, connect to the socket.io 
   server at http://localhost:8080.
*/
<script src="/socket.io/socket.io.js"></script>
<script>
  // use the socket.io server to connect to localhost:8080 here
  var socket = io.connect('http://localhost:8080');
</script>


// -----------------------------------------------------------------------------
// 6.4 Listening For Questions
// ---------------------------
/*
In our client below, listen for 'question' events from the server and call the 
insertQuestion function whenever the event fires.

1. First, listen for 'question' events from the server.

2. Now, have the event callback function call the insertQuestion function. The 
   insertQuestion function is already created for you, and it's placed in its own 
   file. It expects exactly one argument - the question.
*/
<script src="/socket.io/socket.io.js"></script>
<script src="/insertQuestion.js"></script>

<script>
  var server = io.connect('http://localhost:8080');

  // Insert code here
  server.on('question', function (data) {
    insertQuestion(data);
  });
          
</script>


// -----------------------------------------------------------------------------
// 6.5 Broadcasting Questions
// --------------------------
/*
When a question is submitted to our server, we want to broadcast it out to all 
the connected clients so they can have a chance to answer it.

1. In the server, listen for 'question' events from clients.

2. Now, emit the 'question' event on all the other clients connected, passing 
   them the question data.
*/
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (client) {
  console.log("Client connected...");
  client.on('question', function (data) {
    client.broadcast.emit('question', data);
  });
});

server.listen(8080);


// -----------------------------------------------------------------------------
// 6.6 Saving Client Data
// ----------------------
/*
In our real-time Q&A app, we want to allow each client only one question at a time, 
but how do we enforce this rule? We can use socket.io's ability to save data on the 
client, so whenever a question is asked, we first want to check the question_asked 
value on the client.

1. First, when a client emits a 'question' event, we want to set the value of 
   question_asked to true.

2. Second, when a client emits a 'question' event, we want to broadcast that 
   question to the other clients.

3. Finally, when a client emits a 'question' event, check to make sure question_asked 
   is not already set to true. We only want to allow one question per user, so make 
   sure that we only set the value of question_asked and broadcast the question to 
   other clients when the value of question_asked is not already true.
*/
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(client) {
  console.log("Client connected...");

  client.on('question', function(question) {
    if (client.question_asked !== true) {
      client.question_asked = true;
      client.broadcast.emit('question', question);
    }
  });
});

server.listen(8080);


// -----------------------------------------------------------------------------
// 6.7 Answering Questions
// -----------------------
/*
Clients can also answer each other's questions, so let's build that feature by 
first listening for the 'answer' event on the client, which will send us both 
the question and answer, which we want to broadcast out to the rest of the 
connected clients.

1. With the client, listen for the 'answer' event from clients.

2. Now, emit the 'answer' event on all the other clients connected, passing them 
   the question data.
*/
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function (client) {
  console.log('Client connected...');

  // listen for answers here
  client.on('answer', function (question, answer) {
    client.broadcast.emit('answer', question, answer);
  });

  client.on('question', function (question) {
    if (!client.question_asked) {
      client.question_asked = true;
      client.broadcast.emit('question', question);
    }
  });
});
server.listen(8080);


// -----------------------------------------------------------------------------
// 6.8 Answering Question Client
// -----------------------------
/*
Now on the client, listen for the 'answer' event and then broadcast both the 
question and the answer to the connected clients.

1. Listen for the 'answer' event off of the server.

2. Call the answerQuestion function, passing in both the question and the answer 
   that was broadcast from the server.
*/

<script src="/socket.io/socket.io.js"></script>
<script>
  var server = io.connect('http://localhost:8080');

  server.on('question', function (question) {
    insertQuestion(question);
  });

  server.on('answer', function (question, answer) {
    answerQuestion(question, answer);
  });


</script>
