angular.module('covey.covey', [])
.controller('coveyController', function ($scope, coveyService) {
  // TODO: get user object from shared main service
  $scope.user = coveyService.getUser();

  // on /covey load, use factory GET request for covey table details
  $scope.details = coveyService.getCovey();
  $scope.updateCovey = () => {
    coveyService.updateCovey($scope.details);
  };
});
