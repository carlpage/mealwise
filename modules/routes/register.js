var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var user = require('../user');
var pg = require('pg');

var config = {
  database: 'pabs_packs',
  host: 'localhost',
  port: 5432, // always use this port for localhost postgresql
  max: 12
};

var pool = new pg.Pool(config);

// add user
app.post('/user', urlencodedParser, function(req, res) {
  console.log('POST to users');
  // assemble object to send
  var objectToSend = {
    response: 'from POST users route'
  }; // end objectToSend
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('err connecting to db');
      done();
      res.send(400)
    } else {
      console.log('connected to db');
      var newUser = [];
      var resultSet = client.query('INSERT INTO users (email, password) VALUES(' + req.body.email + ', crypt('12345', gen_salt('bf', 8)))'); //how would I get the crypt and salt to work?
      resultSet.on('row', function(row) {
        allUsers.push(row);
      }); // end
      resultSet.on('end', function() {
        done();
        res.send(newUser);
      });
    } // end no error
  }); // end pool connect
});
