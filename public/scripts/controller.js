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
]); // to switch out style sheets accordingly between routes

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
  var menuArray = []; // gets filled with entire menu
  vm.somePlaceholder = 'Post your comment here...'; // for comments placeholder
  vm.spinner = false; // for loading screen
  vm.isCollapsed = true; // google maps boolean
  vm.mapButton = true; //for google maps collapse
  vm.pagination = true; // pagination hide boolean
  vm.text = 'Hide Location';

  vm.go = function(path) {
    $location.url(path);
  };

  // google maps
  vm.initMap = function(name) {
    var coords = {
      lat: Number(name.latitude),
      lng: Number(name.longitude)
    };
    console.log(coords);
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: coords
    });
    var marker = new google.maps.Marker({
      position: coords,
      map: map
    });
  }
  // end google maps

  vm.changeBtnText = function() {
    vm.text = 'Show Location';
  }

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
  } // meh, turns out I didn't really need to do this

  vm.currentPage = 4;

  // vm.setPage = function (pageNo) {
  //   vm.currentPage = pageNo;
  // };
  //
  // vm.pageChanged = function() {
  //   $log.log('Page changed to: ' + vm.currentPage);
  // };
  //
  // vm.maxSize = 5;
  // vm.bigTotalItems = 175;
  // vm.bigCurrentPage = 1;

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
    vm.menuInfo = [];
    vm.restaurantName = [];
    vm.mapButton = true;
    vm.pagination = true;
    vm.mapToggle = true;
    MealService.openMenuGet(searchObject).then(function(response) {
      vm.spinner = true; // hell yeah show that loader thingy
      if (response.response.result.errors) { //sweet alert if restaurant isn't found
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
          vm.spinner = false;
          vm.mapButton = false;
          vm.pagination = false;
          vm.mapToggle = false;
          var c = 0;
          for (var a = 0; a < vm.menuInfo.length; a++) {
            c++
            for (var b = 0; b < vm.menuInfo[a].menu_items.length; b++) {
              c++
              vm.menuInfo[a].menu_items[b].id = c;
            }
          }
          vm.initMap(vm.restaurantName);
          vm.menuPush(vm.menuInfo);
        });
      }
    });
  } // end openMenuGet

  vm.menuRequest = function() {
    console.log(MealService.sl[0]);
    vm.spinner = true;
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
          vm.mapButton = false;
          vm.pagination = false;
          vm.initMap(vm.restaurantName);
          var k = 0;
          for (var i = 0; i < vm.menuInfo.length; i++) {
            k++
            for (var j = 0; j < vm.menuInfo[i].menu_items.length; j++) {
              k++
              vm.menuInfo[i].menu_items[j].id = k;
            }
          }
          console.log('back in restaurantGet with: ', vm.menuInfo);
          vm.spinner = false;
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
      swal({
        type: 'success',
        title: 'Rating added!',
        timer: 2000
      }).then(
        function() {},
        // handling the promise rejection
        function(dismiss) {
          if (dismiss === 'timer') {
            console.log('I was closed by the timer');
          }
        })
    });
  } // end postRating

  vm.postComment = function(item) {
    var commentObject = {
      restaurant: vm.restaurantName.restaurant_name,
      meal: item.menu_item_name,
      comment: vm.newComment
    };
    MealService.postComment(commentObject).then(function() {
      swal({
        type: 'success',
        title: 'Comment added!',
        timer: 2000
      }).then(
        function() {},
        // handling the promise rejection
        function(dismiss) {
          if (dismiss === 'timer') {
            console.log('I was closed by the timer');
          }
        })
      vm.newComment = '';
      vm.somePlaceholder = 'Your comment has been posted!';
    });
  } // end postComment

  vm.getComments = function(item) {
    MealService.getComments(item.menu_item_name).then(function() {
      vm.comments = MealService.commentData;
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
      swal({
        type: 'success',
        title: 'Image added!',
        timer: 2000
      }).then(
        function() {},
        // handling the promise rejection
        function(dismiss) {
          if (dismiss === 'timer') {
            console.log('I was closed by the timer');
          }
        })
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
