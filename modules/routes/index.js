var express = require('express');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var user = require('../user');
var bcrypt = require('bcrypt');

// uses
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/', function(req, res) {
  console.log('base url head');
  res.sendFile(path.resolve('public/views/index.html'));
});

router.post('/', function(req, res) {
  console.log('base post hit:', req.body);
  // Seeing if the username exists
  user.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      console.log('find user err', err);
      res.sendStatus(400)
    } else {
      //compares passwords
      if (user != undefined) {
        console.log('comparing: ', req.body.password, user.password);
        bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
          if (err) {
            console.log('compare err', err);
            res.sendStatus(400)
          } else {
            console.log('found you');
            if (isMatch) {
              res.send('Match!!!')
            } else {
              res.send('no match')
            }
          }
        });
      } else {
        console.log('no user found');
        res.send(400);
      }
    }
  }); // end findOne
}); // end post

module.exports = router;
