angular.module('covey.covey')
.service('coveyService', function ($http, $routeParams) {
  this.getCovey = () => {
    return $http.get(`/api/covey/${$routeParams.coveyId}`)
    .then((response) => response.data, (error) => {
      console.error(error);
    });
  };

  this.updateCovey = (covey) => {
    return $http.put(`/api/coveys/${$routeParams.coveyId}`, covey)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };
});
