const createCovey = angular.module('createCovey', ['covey.services']);

createCovey.controller('createCoveyController', function ($scope, $rootScope, $location, coveysFactory) {
  // Visibility of modal
  $scope.visible = false;

  // Visiblity of error message. Will show up if the event did not submit properly
  $scope.errorVisible = false;

  $scope.toggleModalVisibility = () => {
    $scope.visible = !$scope.visible;
  };

  $scope.toggleErrorVisibility = () => {
    $scope.errorVisible = !$scope.errorVisible;
  };
  // Resets the form fields to empty
  $scope.resetFormFields = () => {
    $scope.eventName = '';
    $scope.eventLocation = '';
    $scope.eventAddress = '';
    $scope.eventCity = '';
    $scope.eventState = '';
    $scope.eventStartDate = '';
    $scope.eventStarTime = '';
    $scope.eventEndDate = '';
    $scope.eventEndTime = '';
    $scope.eventDescription = '';
  };
  // Set form fields to empty, by default
  $scope.resetFormFields();
  /*
   * Submits new covey to the server. If successful (201 response),
   * it will close the modal and angular will redirect the bew covey
  */
  $scope.submitCovey = () => {
    const coveyData = {
      name: $scope.eventName,
      location: $scope.eventLocation,
      address: $scope.eventAddress,
      city: $scope.eventCity,
      state: $scope.eventState,
      startDate: $scope.eventStartDate,
      startTime: $scope.eventStartTime,
      endDate: $scope.eventEndDate,
      endTime: $scope.eventEndTime,
      details: $scope.eventDescription,
      blurb: $scope.eventDescription.slice(0, 100),
    };
    coveysFactory.postCovey(coveyData)
      .then((response) => {
        if (response.status !== 201) {
          $scope.toggleErrorVisibility();
        } else {
          $scope.toggleModalVisibility();
          $scope.resetFormFields();
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
