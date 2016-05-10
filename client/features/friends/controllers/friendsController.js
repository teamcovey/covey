angular.module('friends', ['friends.services', 'userId.services'])

.controller('friendsController', function ($scope, $location, $rootScope, friendsFactory) {
  /*
   * showFriends can have a value of 'true', 'false', 'empty', 'search',
   * or 'error' the view will automatically change based on the value.
   */
  $scope.showFriends = 'true';
  $scope.friends = [];
  // Routes user to the specified covey (based on coveyId)
  $scope.removeFriend = (friendId) => {
    let friendIndex;
    friendsFactory
      .removeFriend(friendId)
      .then((response) => {
        const data = response.data;
        if (data.success && data.success === true) {
          for (let i = 0; i < $scope.friends.length; i++) {
            if ($scope.friends[i].id === friendId) {
              friendIndex = i;
              break;
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
        const data = response.data;
        if (data.users.length === 0) {
          // When showFriends is equal to 'empty' a different view will be displayed on the page
          $scope.showFriends = 'empty';
        } else {
          $scope.found = data.users;
          $scope.showFriends = 'search';
        }
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
            $scope.showFriends = 'false';
          } else {
            $scope.friends = data;
          }
        }
      });
  };
  /*
   * Automatically gets all friends on page load.
   */
  $scope.getFriends();
});
