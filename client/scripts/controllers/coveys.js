// Test data. To be removed once server is up.
const testData = [
  {
    name: 'Brochella 2016',
    blurb: 'Eat, sleep, rave, repeat',
    startTime: 'April 15th, 2016',
    endTime: 'April 17th, 2016',
    isOwner: true,
    photoUrl: '../styles/img/200x200.png',
    covey_id: '123',
  },
  {
    name: 'Burning man',
    blurb: 'Hang out with Toben in the desert',
    startTime: 'August 28th, 2016',
    endTime: 'August 30th, 2016',
    isOwner: false,
    photoUrl: '../styles/img/200x200.png',
    covey_id: '12345',
  },
  {
    name: 'Camping at Redwood National and State Park',
    blurb: 'Drink beer with the bears',
    startTime: 'July 4th, 2016',
    endTime: 'July 7th, 2016',
    isOwner: true,
    photoUrl: '../styles/img/200x200.png',
    covey_id: '12345',
  },
];

angular.module('coveys', ['covey.services'])

.controller('coveysController', function ($scope, $location, $rootScope, coveysFactory) {
  /*
   * hasCoveys can have a value of 'true', 'false', or 'error'
   * the view will automatically change based on the value.
   */
  $scope.hasCoveys = 'true';
  // Setting to testData for now, will update once server isrunning
  $scope.coveys = testData;
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
        if (data.coveys === undefined || status === undefined) {
          // When hasCoveys is equal to 'error' a different view will be displayed on the page
          $scope.hasCoveys = 'error';
        } else {
          if (data.coveys.length === 0) {
            // When hasCoveys is equal to 'false' a different view will be displayed on the page
            $scope.hasCoveys = 'false';
          } else {
            $scope.coveys = data.coveys;
            $scope.sortCoveysByOwnershipStatus($scope.coveys);
          }
        }
      });
  };
  /*
   * Automatically gets all coveys on page load.
   * TODO: uncomment the below line once server is running.
   */
  // $scope.getCoveys();
});
