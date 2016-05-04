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
    // updateCovey endpoint api service not built yet:
    // coveyService.updateCovey($scope.details).then((updatedCovey) => {
    //   $scope.details = updatedCovey;
    // });
  };
});
