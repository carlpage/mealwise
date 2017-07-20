myApp.service('MealService', function($http) {
  var sv = this;
  var storageList = [];
  var openMenuToken = '8c3043ce-5bb0-11e7-8837-00163eeae34c';

  sv.logIn = function(credentials) {
    return $http({
      method: 'POST',
      url: '/',
      data: credentials
    }).then(function(response) {
      console.log('back from login attempt:', response);
      sv.response = response;
    });
  } // end logIn

  sv.register = function(credentials) {
    return $http({
      method: 'POST',
      url: '/register',
      data: credentials
    }).then(function(response) {
      console.log('back from register attempt:', response);
      sv.response = response;
    });
  } // end register

});
