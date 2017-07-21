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
    controller: "packController as pc",
    css: "styles/style.css"
  }).when('/login', {
    templateUrl: "partials/login.html",
    controller: "packController as pc",
    css: "styles/style.css"
  }).when('/registerUser', {
    templateUrl: "partials/registerUser.html",
    controller: "packController as pc",
    css: "styles/style.css"
  }).when('/dashboard', {
    templateUrl: "partials/dashboard.html",
    controller: "packController as pc",
    css: "styles/dashboard.css"
  }).when('/inventory', {
    templateUrl: "partials/inventory.html",
    controller: "packController as pc",
    css: "styles/inventory.css",
  }).when('/tracker', {
    templateUrl: "partials/tracker.html",
    controller: "packController as pc",
    css: "styles/tracker.css",
  });
}]);

myApp.controller('packController', function(MealService, $location) {
  console.log('in the controller');
  var vm = this;

  vm.go = function(path) {
    $location.url(path);
  };

  vm.logIn = function() {
    console.log('clicked logIn');
    var registerObject = {
      email: vm.emailInput,
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
      email: vm.registerEmail,
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

});
