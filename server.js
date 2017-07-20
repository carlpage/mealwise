// requires
var express = require('express');
var app = express();
var index = require('./modules/routes/index');
var inventory = require('./modules/routes/inventory');
var meals = require('./modules/routes/meals');

// uses
app.use( express.static('public'));
app.use('/', index);
app.use('/inventory', inventory);
app.use('/restaurants', meals);

// globals
var port = process.env.PORT || 8765;

// spin up server
app.listen(port, function() {
  console.log('server up on:', port);
}); // end spin up
