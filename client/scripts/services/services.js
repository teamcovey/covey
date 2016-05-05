const coveyServices = angular.module('covey.services', []);

// The 'Coveys' factory is responsible for interacting with the /api/coveys endpoint
coveyServices.factory('coveysFactory', function ($http) {
  return ({
    // Gets the full set of coveys for this user
    getCoveys: () => {
      const requestUrl = '/api/coveys';
      return $http.get(requestUrl)
        .then((response) => response, (response) => response);
    },
    // Creates a new covey for this user
    postCovey: (coveyData) => {
      const requestUrl = '/api/coveys';
      return $http.post(requestUrl, coveyData)
        .then((response) => response, (response) => response);
    },
    // Gets a single covey for this user
    getCovey: (coveyId) => {
      const requestUrl = '/api/coveys/'.concat(coveyId);
      return $http.get(requestUrl)
        .then((response) => response, (response) => response);
    },
    // Updates a covey based on user changes
    putCovey: (coveyData, coveyId) => {
      const requestUrl = '/api/coveys/'.concat(coveyId);
      const requestData = {
        covey: coveyData,
      };
      return $http.get(requestUrl, {
        data: requestData,
      })
        .then((response) => response, (response) => response);
    },
    // Deletes a covey, based on user request
    deleteCovey: (coveyId) => {
      const requestUrl = '/api/coveys/'.concat(coveyId);
      return $http.delete(requestUrl)
        .then((response) => response, (response) => response);
    },
  });
});
