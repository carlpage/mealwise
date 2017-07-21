myApp.service('MealService', function($http) {
  var sv = this;

  sv.logIn = function(credentials) {
    return $http({
      method: 'POST',
      url: '/user',
      data: credentials
    }).then(function(response) {
      console.log('back from login attempt:', response);
      sv.response = response;
    });
  } // end logIn

  sv.register = function(credentials) {
    return $http({
      method: 'POST',
      url: '/user',
      data: credentials
    }).then(function(response) {
      console.log('back from register attempt:', response);
      sv.response = response;
    });
  } // end register

});
