myApp.service('MealService', function($http) {
  var sv = this;
  var usernameList = [];
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
    });
  } // end register

  sv.addUsername = function(username) {
    console.log(usernameList);
    sv.ul = usernameList;
    return usernameList.unshift(username);
  };

  sv.getUsername = function() {
    console.log(usernameList);
    sv.ul = usernameList;
    return sv.ul;
  };

  sv.addRequest = function(storageObject) {
    console.log(storageList);
    sv.sl = storageList;
    return storageList.unshift(storageObject);
  };

  sv.getRequests = function() {
    console.log(storageList);
    sv.sl = storageList;
    return sv.sl;
  };

  sv.openMenuGet = function(restaurant) {
    console.log('info', restaurant);
    return $http({
      method: 'GET',
      url: 'https://openmenu.com/api/v2/search.php?key=8c3043ce-5bb0-11e7-8837-00163eeae34c', // edit parameters
      headers: {
        'key': openMenuToken
      },
      params: {
        s: restaurant.name,
        city: restaurant.city,
        state: 'MN',
        country: 'US'
      }
    }).then(function(response) {
      console.log('in service, restaurant data: ', response.data);
      sv.menuData = response.data;
      return response.data;
    });
  } // end openMenuGet

  sv.restaurantGet = function(id) { // test
    return $http({
      method: 'GET',
      url: 'https://openmenu.com/api/v2/restaurant.php?key=8c3043ce-5bb0-11e7-8837-00163eeae34c', // edit parameters
      headers: {
        'key': openMenuToken
      },
      params: {
        id: id
      }
    }).then(function(response) {
      console.log('in service, Menu data: ', response.data);
      return response.data;
    });
  } // end openMenuGet

  sv.getRating = function(item) {
    return $http({
      method: 'GET',
      url: '/restaurants/add/' + item + '/rating'
    }).then(function(response) {
      console.log('back from getRating:', response.data);
      sv.data = response.data;
    }); // find the average rating
  }

  sv.postRating = function(ratingObject) {
    return $http({
      method: 'POST',
      url: '/restaurants/add/' + ratingObject.meal + '/rating',
      data: ratingObject
    }).then(function(response) {
      console.log('back from postRating:', response);
    });
  }

});
