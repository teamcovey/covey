angular.module('covey.covey', [])
.controller('coveyController', function ($scope, coveyService) {
  coveyService.getCovey().then((response) => {
    $scope.details = response.covey;
    // TODO: add validation to check that photoUrl is a real url:
    $scope.showPhoto = response.covey.photoUrl.length ? true : false;
  });

  $scope.toggleEdit = () => {
    $scope.editDetails = !$scope.editDetails;
  };

  $scope.formatDate = (dateToFormat) => {
    if (dateToFormat && dateToFormat.toString().length) {
      return new Date(dateToFormat).toString().slice(0, 21);
    }
    return '';
  };

  $scope.updateCovey = () => {
    coveyService.updateCovey($scope.details);
    // TODO: add validation to check that photoUrl is a real url:
    $scope.showPhoto = $scope.details.photoUrl.length ? true : false;
  };

  $scope.selection = 'details';

  $scope.navbarSwitch = (clicked) => {
    $scope.selection = clicked;
  };

  $scope.isSelected = (section) => {
    return $scope.selection === section;
  };
});
