var express = require('express');
var app = express();

var logger = require('./logger');
app.use(logger);

app.use(express.static('public'));

var blocks = require('./routes/blocks');
var locations = require('./routes/locations');

app.use('/blocks', blocks);
app.use('/locations', locations);

app.listen(3000, function() {
  console.log("Listening on port %d", 3000);
});