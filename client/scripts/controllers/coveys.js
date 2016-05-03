// Test data. To be removed once server is up.
const testData = [
  {
    name: 'Brochella 2016',
    description: 'Eat, sleep, rave, repeat',
    date: 'April 15th, 2016',
    admin: true,
    attending: true,
    image: '../styles/img/200x200.png',
    id: '12345',
  },
  {
    name: 'Burning man',
    description: 'Hang out with Toben in the desert',
    date: 'August 28th, 2016',
    admin: false,
    attending: true,
    image: '../styles/img/200x200.png',
    id: '12345',
  },
  {
    name: 'Camping at Redwood National and State Park',
    description: 'Drink beer with the bears',
    date: 'July 4th, 2016',
    admin: true,
    attending: true,
    image: '../styles/img/200x200.png',
    id: '12345',
  },
];

const coveys = angular.module('coveys', ['covey.services']);

coveys.controller('coveysController', ($scope, $location, $rootScope, coveysFactory) => {
  $scope.hasCoveys = 'true';
  // Setting to testData for now, will update once server isrunning
  $scope.coveys = testData;
  // Routes user to the specified covey (based on id)
  $scope.goToCovey = (id) => {
    $location.path('/coveys/'.concat(id));
  };
  /*
   *  Triggered whenever the 'create' button is clicked.
   *  Will toggle visibility of the create covey modal.
   */
  $scope.toggleCreateCoveyModal = () => {
    $rootScope.$broadcast('toggleCreateCoveyModal');
  };
  // Sorts coveys based on whether the user is planning/attending/not attending
  $scope.sortCoveysByAttendingStatus = (arrayOfCoveys) => {
    const coveysArray = arrayOfCoveys;
    for (let i = 0; i < coveysArray.length; i++) {
      for (let j = 0; j < coveysArray.length - 1; j++) {
        if (!coveysArray[j].admin && coveysArray[j + 1].admin) {
          const temp = coveysArray[j];
          coveysArray[j] = coveysArray[j + 1];
          coveysArray[j + 1] = temp;
        } else if (!coveysArray[j].attending && coveysArray[j + 1].attending) {
          const temp = coveysArray[j];
          coveysArray[j] = coveysArray[j + 1];
          coveysArray[j + 1] = temp;
        }
      }
    }
  };
  /*
   * Gets all coveys from the server (for the current user)
   * TODO: Refactor based on actual server implementation
   */
  $scope.getCoveys = () => {
    let status;
    let data;
    coveysFactory
      .getCoveys()
      .then((response) => {
        status = response.status;
        data = response.data;
        if (status === undefined) {
          // When hasCoveys is equal to 'error' a different view will be displayed on the page
          $scope.hasCoveys = 'error';
        } else {
          if (data.coveys.length === 0) {
            // When hasCoveys is equal to 'false' a different view will be displayed on the page
            $scope.hasCoveys = 'false';
          } else {
            $scope.coveys = data.coveys;
            $scope.sortCoveysByAttendingStatus($scope.coveys);
          }
        }
      });
  };
  // Automatically gets all coveys on page load
  $scope.getCoveys();
});
