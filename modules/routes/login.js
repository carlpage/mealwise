var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var pg = require('pg');

var config = {
  database: 'pabs_packs',
  host: 'localhost',
  port: 5432, // always use this port for localhost postgresql
  max: 12
};

var pool = new pg.Pool(config);

// get user
app.get('/user', function(req, res) {
  console.log('GET user route hit');
  // assemble object to send
  var objectToSend = {
    response: 'from GET user route'
  }; // end objectToSend
  // send info back to client
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('err connecting to db');
      done();
      res.send('nope!!');
    } else {
      var email = req.body.email;
      var password = req.body.password;
      console.log('connected to db');
      var user = connection.query('SELECT * FROM users WHERE email = lower(' + email + ') AND password = crypt("12345", ' + password + ')');
      resultSet.on('row', function(row) {
        user.push(row);
      }); // end
      resultSet.on('end', function() {
        done();
        res.send(user);
      });
    } // end no error
  }); // end pool connect
});

module.exports = router;
