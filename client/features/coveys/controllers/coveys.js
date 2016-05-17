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
  $scope.goToCovey = (covey) => {
    $location.path(`/coveys/${covey.covey_id}`);
  };

  // Confirms whether user wants to delete covey
  $scope.confirmDeletion = (covey, event) => {
    // Prevent's parent div's ng-click from being triggered
    event.stopPropagation();
    // Toggles the confirm deletion view
    covey.confirmDelete = true;
  }
  // Deletes the covey
  $scope.deleteCovey = (covey, event) => {
    // Prevent's parent div's ng-click from being triggered
    event.stopPropagation();
    // Deletes the covey
    const coveyIndex = $scope.coveys.indexOf(covey);
    coveysFactory.deleteCovey(covey.covey_id);
    $scope.coveys.splice(coveyIndex, 1);
  }


  /*
   *  Triggered whenever the 'create' button is clicked.
   *  Will toggle visibility of the create covey modal.
   */
  $scope.toggleCreateCoveyModal = () => {
    $rootScope.$broadcast('toggleCreateCoveyModal');
  };
  // Converts the date string to a readable format
  $scope.convertToTextDate = (dateString) => dateFactory.convertToTextDate(dateString);
  // Sorts coveys based on (1) whether the user is owner and (2) the date of the event
  $scope.sortCoveysByOwnershipAndDate = (arrayOfCoveys) => {
    const coveysArray = arrayOfCoveys;
    for (let i = 0; i < coveysArray.length; i++) {
      for (let j = 0; j < coveysArray.length - 1; j++) {
        if (!coveysArray[j].isOwner && coveysArray[j + 1].isOwner) {
          const temp = coveysArray[j];
          coveysArray[j] = coveysArray[j + 1];
          coveysArray[j + 1] = temp;
        } else if (coveysArray[j].isOwner === coveysArray[j + 1].isOwner &&
          new Date(coveysArray[j].startTime) > new Date(coveysArray[j + 1].startTime)) {
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
            $scope.sortCoveysByOwnershipAndDate($scope.coveys);
          }
        }
      });
  };
  /*
   * Automatically gets all coveys on page load.
   */
  $scope.getCoveys();
});
