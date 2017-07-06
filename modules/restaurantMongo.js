var mongoose = require ('mongoose');

mongoose.connect ('localhost:27017/restaurants');

var restaurantSchema = new mongoose.Schema({
  meals: Array
});

var restaurantModel = mongoose.model('restaurantModel', restaurantSchema);

module.exports = restaurantModel;
