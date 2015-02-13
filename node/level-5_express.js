// -----------------------------------------------------------------------------
// Level 5. Express
// ----------------

// Express is a Sinatra inspired Web Development Framework for Node.js --
//         insanely fast, flexible and simple.

// - Easy route URLs to callbacks
// - Middleware (from Connect)
// - Environment based configuration
// - Redirection helpers
// - File Uploads

// Install express: 
// $ npm install --save express <-- Installs the module and adds to package.json
//                                                                 (dependencies)

// require express
var express = require('express');

// Create an instance of express
var app = express();

// Define an endpoint at the root route
app.get('/', function(request, response) {
  response.sendFile(__dirname + "/index.html");
//               current directory
});

app.listen(8080);

// $ curl http://localhost:8080/
// -> 200 OK


// --------------
// Express Routes
// --------------

// app.js
var request = require('request');
var url = require('url');

app.get('/tweets/:username', function(req, response) {
  var username = req.params.username;
  options = {
    protocol: 'http',
    host: 'api.twitter.com',
    pathname: '/1/statuses/user_timeline.json',
    query: { screen_name: username, count: 10 } // Get the last 10 tweets
  }
  var twitterUrl = url.format(options);
  request(twitterUrl).pipe(response);           // Pipe the request to response
});

// $ curl -s http://localhost:8080/tweets/eallam

// The response will be really ugly, but we can make it better with: 'prettyjson'

// $ npm install prettyjson -g

// $ curl -s http://localhost:8080/tweets/eallam | prettyjson


// --------------
// Express + HTML
// --------------

// 1. Install a templating library: 'ejs'

// $ npm install --sabe ejs

// my_app/package.json
"dependencies": {
  "express": "4.9.6".
  "ejs": "1.0.0"
}

// /Home/eric/my_app/views <-- default directory

// app.js
app.get('/tweets/:username', function(req, response) {
  ...
  request(url, function(err, res, body) {
    var tweets = JSON.parse(body);
    response.locals = {
      tweets: tweets, 
      name: username 
    };
    response.render('tweets.ejs');
  });
});


// tweets.ejs
<h1>Tweets for @<%= name %></h1>
<ul>
  <% tweets.forEach(function(tweet) { %>
    <li><%= tweet.text %></li>
  <% }); %>
</ul>


// -----------------------------------------------------------------------------
// 5.2 Express Routes
// ------------------
/*
Let's create an express route that accepts GET requests on '/tweets' and responds 
by sending back a static HTML file.

1. Create a GET route for '/tweets' and give it the proper callback. The callback 
   function should accept two arguments: the request and the response.

2. Send back the file tweets.html, which lives under the project's root path. 
  Remember to use __dirname to locate tweets.html.

3. Make the app listen on port 8080
*/

var express = require('express');
var app = express();

app.get('/tweets', function(req, response) {
  response.sendFile(__dirname + '/tweets.html');
});

app.listen(8080);


// -----------------------------------------------------------------------------
// 5.3 Route Params
// ----------------
/*
Let's create a route that accepts dynamic arguments in the URL path and responds 
with the quote from the proper author.

1. Start by creating a GET route for '/quotes' that takes a name parameter as 
   part of the URL path.

2. Now, use the name parameter from the URL to retrieve a quote from the quotes 
   object and write it out to the response. Note: No piping here, just write the 
   quote string to the response like you did in previous levels (and then close 
   the response).
*/
var express = require('express');
var app = express();

var quotes = {
  'einstein': 'Life is like riding a bicycle. To keep your balance you must keep moving',
  'berners-lee': 'The Web does not just connect machines, it connects people',
  'crockford': 'The good thing about reinventing the wheel is that you can get a round one',
  'hofstadter': 'Which statement seems more true: (1) I have a brain. (2) I am a brain.'
};

app.get('/quotes/:name', function(req, response) {
  response.end(quotes[req.params.name]);
});


app.listen(8080);


// -----------------------------------------------------------------------------
// 5.4 Rendering
// -------------
/*
Instead of just writing out the quote to the response, let's try using an EJS 
template to render the response.

1. First, render the quote.ejs template to the response.

2. Next, make the name and the quote data available to the template.

3. Inside quote.ejs, add the code needed to render the data you passed to the template.
*/

// app.js
var express = require('express');
var app = express();

var quotes = {
  'einstein': 'Life is like riding a bicycle. To keep your balance you must keep moving',
  'berners-lee': 'The Web does not just connect machines, it connects people',
  'crockford': 'The good thing about reinventing the wheel is that you can get a round one',
  'hofstadter': 'Which statement seems more true: (1) I have a brain. (2) I am a brain.'
};

app.get('/quotes/:name', function(req, res) {
  var quote = quotes[req.params.name];
  var author = req.params.name;
  res.render('quote.ejs', {
    name: author,
    quote: quote
  });
});

app.listen(8080);


// views/quote.ejs
<h2>Quote by <%= name %></h2>
<blockquote>
  <%= quote %>
</blockquote>


// -----------------------------------------------------------------------------
// 5.5 URL Building
// ----------------
/*
Let's create a page which calls the Twitter search API and displays the last few 
results for Code School. The first step is to construct the proper URL, which is 
all you need to do in this challenge.

Complete the URL options which will be sent into the the url module's format method. 
The URL you'll want to construct is the following: 
http://search.twitter.com/search.json?q=codeschool

1. Add the protocol attribute to options.

2. Add the host attribute to options.

3. Add the pathname attribute to options.

4. Add an attribute which takes an object of query parameters, in this case we 
   only need q to search Twitter.
*/

// app.js
var url = require('url');

options = {
  // add URL options here
  protocol: 'http:',
  host: 'search.twitter.com',
  pathname: '/search.json',
  query: { q: "codeschool" }          
};

var searchURL = url.format(options);
console.log(searchURL);


// -----------------------------------------------------------------------------
// 5.6 Doing the Request
// ---------------------
/*
Next, we'll use the request module to make a simple web request and log the 
response to the console. You can use this example in the README.

1. To start, require the request module and assign the return function to a variable.

2. Next, issue a request to searchURL. Remember, the callback function for the 
   request function takes three arguments: error, response and body.

3. Finally, log the response body to the console using console.log().
*/
var url = require('url');

var options = {
  protocol: "http:",
  host: "search.twitter.com",
  pathname: '/search.json',
  query: { q: "codeschool"}
};

var searchURL = url.format(options);

var request = require('request');

request(searchURL, function(err, res, body) {
  console.log(body);
});


// -----------------------------------------------------------------------------
// 5.7 Express Server
// ------------------
/*
Now, let's create an Express server which queries out for the search term and 
then returns the JSON.

1. Require the express module.

2. Create the Express server and name it app.
   
3. Create a route for GET requests to / (root path). Remember, the callback 
   function takes two arguments: a request req and a response res.

4. In our new route, issue a request to searchURL and pipe the results into the response.

5. Finally, tell app to listen on port 8080.
*/
var url = require('url');
var request = require('request');

var options = {
  protocol: "http:",
  host: "search.twitter.com",
  pathname: '/search.json',
  query: {
    q: "codeschool"
  }
};

var searchURL = url.format(options);
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  request(searchURL).pipe(res);
});
app.listen(8080);
