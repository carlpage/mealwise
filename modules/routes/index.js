var express = require('express');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var user = require('../user');

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

}); // end post

module.exports = router;
