angular.module('covey.covey', [])
.controller('coveyController', function ($scope, coveyService) {
  // TODO: get user object from shared main service
  $scope.user = coveyService.getUser();


  coveyService.getCovey().then((covey) => {
    $scope.details = covey;
  });

  $scope.toggleEdit = () => {
    $scope.editDetails = !$scope.editDetails;
  };

  $scope.updateCovey = () => {
    coveyService.updateCovey($scope.details).then((updatedCovey) => {
      console.log(updatedCovey);
    });
  };
});
