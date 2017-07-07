var express = require ('express');
var router = express.Router();
var bodyParser = require ('body-parser');
var mongo = require ('../restaurantMongo');
var mongoose  = require('mongoose');

mongoose.connect('localhost:27017/restaurants');

var mealSchema = new mongoose.Schema({
  rating: Number,
  imageUrl: String,
  comments: Array
});
// get rating and imageUrl working first, and then comments
var mealModel = mongoose.model('mealModel', mealSchema);

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

// router.get( '/', function( req, res ) {
//   console.log( 'mealObjects get call' );
//   mealModel.find().then( function( results ){
//     res.send( results );
//   });
// }); //end meal get call

router.post('add/:meal/comment', function(req,res) {
  console.log('mealObjects url hit', req.body);
  var newComment = req.body;
  console.log('saving comment:', newComment);
  // save newComment to db
  // exporting model from mongo
  mealModel(newComment).save();
  res.sendStatus( 201 );
});

router.post('add/:meal/rating', function(req, res) {
  console.log('mealObjects url hit', req.body);
  var newRating = req.body;
  console.log('saving rating:', newRating);
  // save newRating to db
  // exporting model from mongo
  mealModel(newRating).save();
  res.sendStatus(201);
});

router.post('add/:meal/images', function(req, res) {
  console.log('mealObjects url hit', req.body);
  var newImage = req.body;
  console.log('saving image:', newImage);
  // save newImage to db
  // exporting model from mongo
  mealModel(newImage).save();
  res.sendStatus(201);
});

module.exports = router;
