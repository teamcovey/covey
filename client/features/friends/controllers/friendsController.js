angular.module('friends', ['friends.services', 'userId.services'])

.controller('friendsController', function ($scope, $location, $rootScope, friendsFactory) {
  /*
   * hasCoveys can have a value of 'true', 'false', or 'error'
   * the view will automatically change based on the value.
   */
  $scope.showFriends = 'true';
  $scope.friends = [];
  // Routes user to the specified covey (based on coveyId)
  $scope.removeFriend = (friendId) => {
    let friendIndex = $scope.friends.length;
    friendsFactory
      .removeFriend(friendId)
      .then((response) => {
        const data = response.data;
        if (data.success && data.success === true) {
          for (let i = 0; i < friendIndex; i++) {
            if ($scope.friends[i].id === friendId) {
              friendIndex = i;
            }
          }
          /* because we change the scope locally, we dont need to refresh
            the friends list with a 2nd database query */
          $scope.friends.splice(friendIndex, 1);
          if ($scope.friends.length === 0) {
            $scope.hasFriends = 'false';
          }
        }
      });
  };

  $scope.addFriend = (friendId) => {
    friendsFactory
      .addFriend(friendId)
      .then((response) => {
        const data = response.data;
        $scope.showFriends = 'true';
        if (data.success && data.success === true) {
          // need to rewrite backend to just send the new list of friends
          $scope.getFriends();
        }
      });
  };

  $scope.searchUsers = (searchString) => {
    // let friendIndex = $scope.friends.length;
    friendsFactory
      .searchUsers(searchString)
      .then((response) => {
        console.log('got response in searchFriends...', response.data.users);
        const data = response.data;
        if (data.length === 0) {
          // When hasFriends is equal to 'false' a different view will be displayed on the page
          $scope.Results = 'false';
        } else {
          $scope.found = data.users;
          $scope.Results = 'true';
          $scope.showFriends = 'search';
          // $scope.sortFriendsByOwnershipStatus($scope.friends);
        }
        console.log('make the page reload?');
        // $scope.getFriends();
      });
  };
  /*
   * Gets all friends from the server (for the current user)
   */
  $scope.getFriends = () => {
    friendsFactory
      .getFriends()
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status !== 200) {
          // When hasFriends is equal to 'error' a different view will be displayed on the page
          $scope.showFriends = 'error';
        } else {
          if (data.length === 0) {
            // When hasFriends is equal to 'false' a different view will be displayed on the page
            $scope.showFriends = 'false';
          } else {
            $scope.friends = data;
            // $scope.sortFriendsByOwnershipStatus($scope.friends);
          }
        }
      });
  };
  /*
   * Automatically gets all friends on page load.
   */
  $scope.getFriends();
});
