var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/restaurants');

var ratingSchema = new mongoose.Schema({
  restaurant: String,
  meal: String,
  rating: Number
});
var imageSchema = new mongoose.Schema({
  restaurant: String,
  meal: String,
  image: String
});
var commentSchema = new mongoose.Schema({
  restaurant: String,
  meal: String,
  posted: Date,
  comments: String
});

// get rating and imageUrl working first, and then comments
var ratingModel = mongoose.model('ratingModel', ratingSchema);
var imageModel = mongoose.model('imageModel', imageSchema);
var commentModel = mongoose.model('commentModel', commentSchema);

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/add/:meal/rating', function(req, res) {
  console.log('ratings get call', req.params.meal);
  ratingModel.find({
    meal: req.params.meal
  }).then(function(results) {
    res.send(results);
  });
}); // end meal get call

router.post('/add/:meal/rating', function(req, res) {
  console.log('ratings url hit', req.body);
  var newRating = {
    restaurant: req.body.restaurant,
    meal: req.body.meal,
    rating: req.body.rating
  }
  // save newRating to db
  // exporting model from mongo
  ratingModel(newRating).save();
  res.sendStatus(201);
});

router.get('/add/:meal/comments', function(req, res) {
  console.log('comments get call', req.params.meal);
  commentModel.find({
    meal: req.params.meal
  }).then(function(results) {
    res.send(results);
  });
}); // end meal get call

router.post('/add/:meal/comments', function(req, res) {
  var newComment = {
    restaurant: req.body.restaurant,
    meal: req.body.meal,
    posted: new Date(),
    comments: req.body.comment
  }
  console.log('saving comment:', newComment);
  // save newComment to db
  // exporting model from mongo
  commentModel(newComment).save();
  res.sendStatus(201);
});

router.get('/add/:meal/images', function(req, res) {
  console.log('images get call', req.params.meal);
  imageModel.find({
    meal: req.params.meal
  }).then(function(results) {
    res.send(results);
  });
}); // end meal get call

router.post('/add/:meal/images', function(req, res) {
  var newImage = {
    restaurant: req.body.restaurant,
    meal: req.body.meal,
    image: req.body.image
  }
  console.log('saving image:', newImage);
  // save newImage to db
  // exporting model from mongo
  imageModel(newImage).save();
  res.sendStatus(201);
});

module.exports = router;
