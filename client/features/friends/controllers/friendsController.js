// Test data. To be removed once server is up.
const friendTestData = [
  {
    firstName: 'Foo',
    lastName: 'Bar',
    photoUrl: '../styles/img/200x200.png',
    id: '123',
    emamil: 'foo@bar.com',
  },
  {
    firstName: 'Fake',
    lastName: 'Friend',
    photoUrl: '../styles/img/200x200.png',
    id: '124',
    email: 'not@real.com',
  },
];

angular.module('friends', ['friends.services', 'userId.services'])

.controller('friendsController', function ($scope, $location, $rootScope, friendsFactory) {
  /*
   * hasCoveys can have a value of 'true', 'false', or 'error'
   * the view will automatically change based on the value.
   */
  $scope.hasFriends = 'true';
  // Setting to testData for now, will update once server isrunning
  $scope.friends = friendTestData;
  // Routes user to the specified covey (based on coveyId)
  // $scope.goToCovey = (coveyId) => {
  //   $location.path(`/coveys/${coveyId}`);
  // };
  /*
   *  Triggered whenever the 'create' button is clicked.
   *  Will toggle visibility of the create covey modal.
   */
  // $scope.toggleCreateCoveyModal = () => {
  //   $rootScope.$broadcast('toggleCreateCoveyModal');
  // };
  // Sorts coveys based on whether the user is planning
  // $scope.sortFriendsByOwnershipStatus = (arrayOfFriends) => {
  //   const friendsArray = arrayOfFriends;
  //   for (let i = 0; i < friendsArray.length; i++) {
  //     for (let j = 0; j < friendsArray.length - 1; j++) {
  //       if (!friendsArray[j].isOwner && friendsArray[j + 1].isOwner) {
  //         const temp = friendsArray[j];
  //         friendsArray[j] = friendsArray[j + 1];
  //         friendsArray[j + 1] = temp;
  //       }
  //     }
  //   }
  // };
  /*
   * Gets all coveys from the server (for the current user)
   */
  $scope.getFriends = () => {
    friendsFactory
      .getFriends()
      .then((response) => {
        console.log('got response in getFriends...', response.data);
        const status = response.status;
        const data = response.data;
        if (status !== 200) {
          // When hasCoveys is equal to 'error' a different view will be displayed on the page
          $scope.hasFriends = 'error';
          console.log('error in getFriends in friendsController');
        } else {
          if (data.length === 0) {
            // When hasCoveys is equal to 'false' a different view will be displayed on the page
            $scope.hasFriends = 'false';
            console.log('no friends found in friendsController');
          } else {
            console.log('setting friends to data in friendsController');
            $scope.friends = data;
            // $scope.sortFriendsByOwnershipStatus($scope.friends);
          }
        }
      });
  };
  /*
   * Automatically gets all coveys on page load.
   * TODO: uncomment the below line once server is running.
   */
  $scope.getFriends();
});
