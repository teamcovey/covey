angular.module('coveys', ['covey.services', 'userId.services', 'date.services'])

.controller('coveysController', function ($scope, $location, $rootScope, coveysFactory, dateFactory) {
  if (window.innerWidth > 770) {
    $('.covey').css('width', '97%');
  }

  $(window).resize(() => {
    if (window.innerWidth > 770) {
      $('ul.nav-pills').css('height', '100vh');
      $('.covey').css('width', '97%');
    } else {
      $('ul.nav-pills').css('height', '');
      $('.covey').css('width', '');
    }
  });

  /*
   * hasCoveys can have a value of 'true', 'false', or 'error'
   * the view will automatically change based on the value.
   */
  $scope.hasCoveys = 'false';
  // Setting to testData for now, will update once server isrunning
  $scope.coveys = [];
  // Routes user to the specified covey (based on coveyId)
  $scope.goToCovey = (coveyId) => {
    $location.path(`/coveys/${coveyId}`);
  };
  /*
   *  Triggered whenever the 'create' button is clicked.
   *  Will toggle visibility of the create covey modal.
   */
  $scope.toggleCreateCoveyModal = () => {
    $rootScope.$broadcast('toggleCreateCoveyModal');
  };
  // Converts the date string to a readable format
  $scope.convertToTextDate = (dateString) => dateFactory.convertToTextDate(dateString);
  // Sorts coveys based on whether the user is planning
  $scope.sortCoveysByOwnershipStatus = (arrayOfCoveys) => {
    const coveysArray = arrayOfCoveys;
    for (let i = 0; i < coveysArray.length; i++) {
      for (let j = 0; j < coveysArray.length - 1; j++) {
        if (!coveysArray[j].isOwner && coveysArray[j + 1].isOwner) {
          const temp = coveysArray[j];
          coveysArray[j] = coveysArray[j + 1];
          coveysArray[j + 1] = temp;
        }
      }
    }
  };
  /*
   * Gets all coveys from the server (for the current user)
   */
  $scope.getCoveys = () => {
    coveysFactory
      .getCoveys()
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status !== 200) {
          // When hasCoveys is equal to 'error' a different view will be displayed on the page
          $scope.hasCoveys = 'error';
        } else {
          if (data.length === 0) {
            // When hasCoveys is equal to 'false' a different view will be displayed on the page
            $scope.hasCoveys = 'false';
          } else {
            $scope.hasCoveys = 'true';
            $scope.coveys = data;
            $scope.sortCoveysByOwnershipStatus($scope.coveys);
          }
        }
      });
  };
  /*
   * Automatically gets all coveys on page load.
   */
  $scope.getCoveys();
});
