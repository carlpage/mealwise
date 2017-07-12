$(document).ready(function() {
  $('collapse').collapse();
});

var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

myApp.directive('head', ['$rootScope', '$compile',
  function($rootScope, $compile) {
    return {
      restrict: 'E',
      link: function(scope, elem) {
        var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
        elem.append($compile(html)(scope));
        scope.routeStyles = {};
        $rootScope.$on('$routeChangeStart', function(e, next, current) {
          if (current && current.$$route && current.$$route.css) {
            if (!angular.isArray(current.$$route.css)) {
              current.$$route.css = [current.$$route.css];
            }
            angular.forEach(current.$$route.css, function(sheet) {
              delete scope.routeStyles[sheet];
            });
          }
          if (next && next.$$route && next.$$route.css) {
            if (!angular.isArray(next.$$route.css)) {
              next.$$route.css = [next.$$route.css];
            }
            angular.forEach(next.$$route.css, function(sheet) {
              scope.routeStyles[sheet] = sheet;
            });
          }
        });
      }
    };
  }
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: "partials/login.html",
    controller: "mealController as mc",
    css: "styles/style.css"
  }).when('/login', {
    templateUrl: "partials/login.html",
    controller: "mealController as mc",
    css: "styles/style.css"
  }).when('/registerUser', {
    templateUrl: "partials/registerUser.html",
    controller: "mealController as mc",
    css: "styles/style.css"
  }).when('/home', {
    templateUrl: "partials/home.html",
    controller: "storageController as sc",
    css: "styles/home.css"
  }).when('/restaurantMenu', {
    templateUrl: "partials/restaurantMenu.html",
    controller: "mealController as mc",
    css: "styles/restaurantMenu.css",
  }).when('/carouselTest', {
    templateUrl: "partials/carouselTest.html",
    controller: "mealController as mc",
    css: "styles/restaurantMenu.css",
  });
}]);

myApp.controller('mealController', function(MealService, $location) {
  console.log('in the controller');
  var vm = this;
  vm.myInterval = 5000;
  var menuArray = [];

  vm.go = function(path) {
    $location.url(path);
  };

  vm.menuPush = function(info) {
    var arr = [];
    for (var i = 0; i < info.length; i++) {
      for (var j = 0; j < info[i].menu_items.length; j++) {
        arr.push(info[i].menu_items[j].menu_item_name);
      }
      j = 0;
    }
    // console.log('-------------=======', arr);
    return menuArray.push(arr);
  }

  vm.logIn = function() {
    console.log('clicked logIn');
    var registerObject = {
      username: vm.nameInput,
      password: vm.passwordInput
    };
    MealService.logIn(registerObject).then(function() {
      console.log('from controller', MealService.response);
      if (MealService.response.data === 'Match!!!') {
        vm.go('/home');
      } else {
        swal({
          type: 'error',
          title: 'Rejected!',
          text: 'Username or password not found',
          timer: 3000
        }).then(
          function() {},
          // handling the promise rejection
          function(dismiss) {
            if (dismiss === 'timer') {
              console.log('I was closed by the timer')
            }
          })
      } // end else
    }); // end MealService

  } // end logIn

  vm.register = function() {
    console.log('clicked register');
    var registerObject = {
      username: vm.registerNameInput,
      password: vm.registerPasswordInput
    };
    MealService.register(registerObject).then(function() {
      vm.registerNameInput = '';
      vm.registerPasswordInput = '';
    }); // end then
  } // end register

  vm.logOut = function() {
    vm.nameInput = '';
    vm.passwordInput = '';
  } // end logOut

  // vm.usernameGet = function() {
  //   console.log(MealService.ul[0]);
  //   vm.user = MealService.ul[0];
  // }

  vm.openMenuGet = function() {
    var searchObject = {
      name: vm.nameInput,
      city: vm.cityInput
    }
    MealService.openMenuGet(searchObject).then(function(response) {
      if (response.response.result.errors) {
        swal({
          type: 'error',
          title: 'Nope!',
          text: 'Restaurant not found',
          timer: 3000
        }).then(
          function() {},
          // handling the promise rejection
          function(dismiss) {
            if (dismiss === 'timer') {
              console.log('I was closed by the timer');
            }
          })
      } else {
        console.log('back in openMenuGet with: ', vm.id);
        vm.id = response.response.result.restaurants[0].id;
        MealService.restaurantGet(vm.id).then(function(response) {
          vm.restaurantName = response.response.result.restaurant_info;
          vm.menuInfo = response.response.result.menus[0].menu_groups;
          console.log('back in restaurantGet with: ', vm.menuInfo);
          vm.menuPush(vm.menuInfo);
        });
      }
    });
  } // end openMenuGet

  vm.menuRequest = function() {
    console.log(MealService.sl[0]);
    var obj = MealService.sl[0];
    MealService.openMenuGet(obj).then(function(response) {
      if (response.response.result.errors) {
        swal({
          type: 'error',
          title: 'Nope!',
          text: 'Restaurant not found',
          timer: 3000
        }).then(
          function() {},
          // handling the promise rejection
          function(dismiss) {
            if (dismiss === 'timer') {
              console.log('I was closed by the timer');
            }
          })
      } else {
        console.log('back in openMenuGet with: ', vm.id);
        vm.id = response.response.result.restaurants[0].id;
        MealService.restaurantGet(vm.id).then(function(response) {
          vm.restaurantName = response.response.result.restaurant_info;
          vm.menuInfo = response.response.result.menus[0].menu_groups;
          console.log('back in restaurantGet with: ', vm.menuInfo);
        });
      }
    });
  }

  vm.getRating = function(item) {
    // console.log('Getting the average rating for:', item.menu_item_name);
    MealService.getRating(item.menu_item_name).then(function() {
      vm.ratings = MealService.ratingData;
      // push the ratings into an array
      var menuItem = item.menu_item_name;
      var arr = [];
      var total = 0;
      for (var i = 0; i < vm.ratings.length; i++) {
        arr.push(vm.ratings[i].rating);
      }
      for (var i = 0; i < arr.length; i++) {
        total += arr[i];
      }
      // average the array items
      var average = total / arr.length;
      item.length = vm.ratings.length
      item.avg = average.toFixed(1);
      console.log('back in controller with avg rating for:', menuItem, item.avg, item.length);
    });
  } // end getRating

  vm.postRating = function(item) {
    var values = Object.values(vm.rating);
    var last = values.slice(-1)[0];
    console.log(last);
    var ratingObject = {
      restaurant: vm.restaurantName.restaurant_name,
      meal: item.menu_item_name,
      rating: last
    };
    console.log(ratingObject);
    MealService.postRating(ratingObject).then(function() {
      // vm.openMenuGet(); // How would I post a review immediately to the page? Could reload the page and call openMenuGet based on the inputs.
    });
  } // end postRating

  vm.postComment = function(item) {
    var values = Object.values(vm.newComment);
    var comment = values.slice(-1)[0];
    console.log(comment);
    var commentObject = {
      restaurant: vm.restaurantName.restaurant_name,
      meal: item.menu_item_name,
      comment: comment
    };
    MealService.postComment(commentObject).then(function() {
      // vm.openMenuGet(); // How would I post a review immediately to the page? Could reload the page and call openMenuGet based on the inputs.
    });
  } // end postComment

  vm.getComments = function(item) {
    // console.log('Getting the comment(s) for:', item.menu_item_name);
    MealService.getComments(item.menu_item_name).then(function() {
      vm.comments = MealService.commentData;
      // console.log('back in controller with comments for:', item.menu_item_name, vm.comments);
    });
  } // end getRating

  vm.postImage = function(item) {
    var values = Object.values(vm.newImage);
    var image = values.slice(-1)[0];
    console.log(image);
    var imageObject = {
      restaurant: vm.restaurantName.restaurant_name,
      meal: item.menu_item_name,
      image: image
    };
    MealService.postImage(imageObject).then(function() {
      // vm.openMenuGet(); // How would I post a review immediately to the page? Could reload the page and call openMenuGet based on the inputs.
    });
  } // end postComment

  vm.getImages = function(item) {
    console.log('Getting the image for:', item.menu_item_name);
    MealService.getImages(item.menu_item_name).then(function() {
      vm.images = MealService.imageData;
      console.log('back in controller with images for:', item.menu_item_name, vm.images);
    });
  } // end getImages

});
