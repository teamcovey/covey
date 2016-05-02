const createCovey = angular.module('createCovey', ['covey.services']);

createCovey.controller('createCoveyController', ($scope, $rootScope, coveysFactory) => {
  // Visibility of modal
  $scope.visible = false;

  // Visiblity of error message. Will show up if the event did not submit properly
  $scope.errorVisible = false;

  // New event data
  $scope.eventName = '';
  $scope.eventLocation = '';
  $scope.eventStart = '';
  $scope.eventEnd = '';
  $scope.eventDescription = '';

  $scope.toggleModalVisibility = () => {
    $scope.visible = !$scope.visible;
  };

  $scope.toggleErrorVisibility = () => {
    $scope.errorVisible = !$scope.errorVisible;
  };

  $scope.submitCovey = () => {
    const coveyData = {
      name: $scope.eventName,
      location: $scope.eventLocation,
      start: $scope.eventStart,
      end: $scope.eventEnd,
      description: $scope.eventDescription,
    };
    coveysFactory.postCovey(coveyData)
      .then((response) => {
        if (response.status !== 201) {
          $scope.toggleErrorVisibility();
        } else {
          $scope.toggleModalVisibility();
        }
      });
  };

  $rootScope.$on('toggleCreateCoveyModal', () => {
    $scope.toggleModalVisibility();
  });
});
