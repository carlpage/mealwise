var myApp = angular.module('myApp', ['ngRoute']);

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
    controller: "mealController as mc",
    css: "styles/home.css"
  }).when('/searchResults', {
    templateUrl: "partials/searchResults.html",
    controller: "mealController as mc",
    css: "styles/searchResults.css"
  });
}]);

// function geoFindMe() {
//   var output = document.getElementById("out");
//
//   if (!navigator.geolocation){
//     output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
//     return;
//   }
//
//   function success(position) {
//     var latitude  = position.coords.latitude;
//     var longitude = position.coords.longitude;
//
//     output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
//
//     var img = new Image();
//     img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
//
//     output.appendChild(img);
//   }
//
//   function error() {
//     output.innerHTML = "Unable to retrieve your location";
//   }
//   output.innerHTML = "<p>Locating…</p>";
//
//   navigator.geolocation.getCurrentPosition(success, error);
// }

myApp.controller('mealController', function(MealService, $location) {
  console.log('in the controller');
  var vm = this;

  vm.go = function(path) {
    if (path == '/logIn') {
      $location.path(path);
    } else {
      $location.path(path);
    }
  };

  vm.logIn = function() {
    console.log('clicked log in');
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

  vm.zomatoSearch = function() {
    console.log('in controller, zomatoSearch');
    var searchObject = {
      food: vm.foodInput,
      city: vm.cityInput
    }; // figure out how to send info over to Zomato API and get a response
    console.log(searchObject);
    MealService.zomatoSearch(searchObject).then(function(response) {
      vm.searchInfo = response.restaurants;
      console.log('back in zomatoSearch with: ', vm.searchInfo.restaurants);
    });
  } // end zomatoSearch

  vm.openMenuGet = function() {
    console.log('in controller, openMenuGet');
    MealService.openMenuGet().then(function(response) {
      vm.menuInfo = response;
      console.log('back in openMenuGet with: ', vm.menuInfo);
    });
  } // end openMenuGet

});
