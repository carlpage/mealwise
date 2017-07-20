var pg = require('pg');

var config = {
  database: 'pabs_packs',
  host: 'localhost',
  port: 5432, // always use this port for localhost postgresql
  max: 12
};

var pool = new pg.Pool(config);

// get koalas
app.get('/user', function(req, res) {
  console.log('GET user route hit');
  //assemble object to send
  var objectToSend = {
    response: 'from GET user route'
  }; //end objectToSend
  //send info back to client
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('err connecting to db');
      done();
      res.send('totally dsfahkasdhfjk')
    } else {
      console.log('connected to db');
      var allKoalas = [];
      var resultSet = connection.query('SELECT * from koalaHolla');
      resultSet.on('row', function(row) {
        allKoalas.push(row);
      }); //end
      resultSet.on('end', function() {
        done();
        res.send(allKoalas);
      });
    } //end no error
  }); // end pool connect
});

// add koala
app.post('/user', urlencodedParser, function(req, res) {
  console.log('POST to users');
  //assemble object to send
  var objectToSend = {
    response: 'from POST users route'
  }; //end objectToSend
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('err connecting to db');
      done();
      res.send(400)
    } else {
      console.log('connected to db');
      var newKoala = [];
//       var resultSet = client.query('INSERT INTO users (email, password) VALUES('nick@example.com', crypt('12345', gen_salt('bf', 8)));
// ' + req.body.name + "','" + req.body.age + "','" + req.body.sex + "','" + req.body.readyForTransfer + "','" + req.body.notes + ')');
      resultSet.on('row', function(row) {
        allKoalas.push(row);
      }); //end
      resultSet.on('end', function() {
        done();
        res.send(newKoala);
      });
    } //end no error
  }); // end pool connect
});

var userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;
