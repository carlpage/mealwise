var express = require('express');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var pg = require('pg');

// uses
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var config = {
  database: 'pabs_packs',
  host: 'localhost',
  port: 5432, // always use this port for localhost postgresql
  max: 12
};

var pool = new pg.Pool(config);
