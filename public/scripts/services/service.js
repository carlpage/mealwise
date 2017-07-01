myApp.service('MealService', function($http) {
  var sv = this;
  var openMenuToken = '8c3043ce-5bb0-11e7-8837-00163eeae34c';
  var zomatoToken = '5848f81b153de5fca516aaac161f59f3';
  var parameters = 'Minneapolis'; // test parameter

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
    });
  } // end register

  sv.zomatoSearch = function(searchObject) {
    console.log(searchObject);
    return $http({
      method: 'GET',
      url: 'https://developers.zomato.com/api/v2.1/search?',
      headers: {
        'user_key': zomatoToken
      },
      params: {
        entity_type: 'city',
        q: searchObject.food, // just a test
        sort: 'rating',
        order: 'desc'
      }
    }).then(function(response) {
      console.log(response.data);
      return response.data;
    });
  } // end zomatoSearch

  sv.openMenuGet = function(restaurant) {
    return $http({
      method: 'GET',
      url: 'https://openmenu.com/api/v2/restaurant.php?key=' + openMenuToken + '&name=' + name, // edit parameters
      dataType: "jsonp"
    }).then(function(response) {
      console.log(response.data);
      return response.data;
    });
  } // end openMenuGet

});
