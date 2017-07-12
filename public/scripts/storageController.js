myApp.controller('storageController', function(MealService, $location) {
  // Will be available everywhere in my app
  console.log('in storageController');
  var vm = this;

  vm.go = function(path) {
    $location.url(path);
  };

  // vm.usernameTransfer = function() {
  //   console.log('in usernameTransfer');
  //   var username = vm.nameInput;
  //   console.log(username);
  //   MealService.addUsername(username);
  // };

  vm.dataTransfer = function() {
    console.log('in dataTransfer');
    var searchObject = {
      name: vm.nameInput,
      city: vm.cityInput
    }
    console.log(searchObject);
    MealService.addRequest(searchObject);
    vm.go('/restaurantMenu');
  };

});
// end storageController
