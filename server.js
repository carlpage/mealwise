// requires
var express = require('express');
var app = express();
var inventory = require('./modules/routes/inventory');
var login = require('./modules/routes/login');
var register = require('./modules/routes/register');

// uses
app.use(express.static('public'));
// app.use('/inventory', inventory); // not set up yet
app.use('/login', login);
app.use('/register', register);

// globals
var port = process.env.PORT || 5432;

// spin up server
app.listen(port, function() {
  console.log('server up on:', port);
}); // end spin up
