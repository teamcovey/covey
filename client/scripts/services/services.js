const coveyServices = angular.module('covey.services', []);

// The 'Coveys' factory is responsible for interacting with the /api/coveys endpoint
coveyServices.factory('coveysFactory', function ($http) {
  return ({
    // Gets the full set of coveys for this user
    getCoveys: (endpoint) => {
      const requestUrl = endpoint || '/api/coveys';
      return $http.get(requestUrl)
        .then((response) => response, (error) => error);
    },
    // Creates a new covey for this user
    postCovey: (coveyData, endpoint) => {
      const requestUrl = endpoint || '/api/coveys';
      return $http.post(requestUrl, coveyData)
        .then((response) => response, (error) => error);
    },
    // Gets a single covey for this user
    getCovey: (coveyId, endpoint) => {
      const requestUrl = endpoint || `/api/coveys/${coveyId}`;
      return $http.get(requestUrl)
        .then((response) => response, (error) => error);
    },
    // Updates a covey based on user changes
    putCovey: (coveyData, coveyId, endpoint) => {
      const requestUrl = endpoint || `/api/coveys/${coveyId}`;
      const requestData = {
        covey: coveyData,
      };
      return $http.get(requestUrl, {
        data: requestData,
      })
        .then((response) => response, (error) => error);
    },
    // Deletes a covey, based on user request
    deleteCovey: (coveyId, endpoint) => {
      const requestUrl = endpoint || `/api/coveys/${coveyId}`;
      return $http.delete(requestUrl)
        .then((response) => response, (error) => error);
    },
  });
});
