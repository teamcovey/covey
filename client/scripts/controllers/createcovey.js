const createCovey = angular.module('createCovey', ['covey.services']);

createCovey.controller('createCoveyController', function ($scope, $rootScope, $location, coveysFactory) {
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

  /*
   * Submits new covey to the server. If successful (201 response),
   * it will close the modal and angular will redirect the bew covey
  */
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
          // TODO: Will need to update based on server implementaiton
          const newCoveyId = response.id;
          // Redirects the user to the new covey page
          $location.path('/coveys/'.concat(newCoveyId));
        }
      });
  };
  // Toggles visibility of the modal whenever the create covey button is clicked
  $rootScope.$on('toggleCreateCoveyModal', () => {
    $scope.toggleModalVisibility();
  });
});
