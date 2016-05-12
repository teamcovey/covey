const coveyServices = angular.module('covey.services', []);

// The 'Coveys' factory is responsible for interacting with the /api/coveys endpoint
coveyServices.factory('coveysFactory', function ($http, userIdFactory) {
  return ({
    // Gets the full set of coveys for this user
    getCoveys: () => {
      const userId = userIdFactory.getUserId();
      const requestUrl = `/api/coveys/${userId}`;
      return $http.get(requestUrl)
        .then((response) => response, (error) => error);
    },
    // Creates a new covey for this user
    postCovey: (coveyData) => {
      const requestUrl = '/api/coveys';
      return $http.post(requestUrl, coveyData)
        .then((response) => response, (error) => error);
    },
    // Gets a single covey for this user
    getCovey: (coveyId) => {
      const requestUrl = `/api/coveys/${coveyId}`;
      return $http.get(requestUrl)
        .then((response) => response, (error) => error);
    },
    // Updates a covey based on user changes
    putCovey: (coveyData, coveyId) => {
      const requestUrl = `/api/coveys/${coveyId}`;
      const requestData = {
        covey: coveyData,
      };
      return $http.get(requestUrl, {
        data: requestData,
      })
        .then((response) => response, (error) => error);
    },
    // Deletes a covey, based on user request
    deleteCovey: (coveyId) => {
      const requestUrl = `/api/coveys/${coveyId}`;
      return $http.delete(requestUrl)
        .then((response) => response, (error) => error);
    },
  });
});

const userIdService = angular.module('userId.services', []);

userIdService.factory('userIdFactory', () => {
  return ({
    // Parses out and returns user_id cookie
    getUserId: () => {
      return document.cookie && document.cookie.match(/user_id=(\w+);*/)
        ? document.cookie.match(/user_id=(\w+);*/)[1] || '' : '';
    },
  });
});
