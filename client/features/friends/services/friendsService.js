const friendServices = angular.module('friends.services', []);

// The 'Coveys' factory is responsible for interacting with the /api/coveys endpoint
friendServices.factory('friendsFactory', function ($http, userIdFactory) {
  return ({
    // Gets the full set of coveys for this user
    getFriends: () => {
      const userId = userIdFactory.getUserId();
      const requestUrl = `/api/friends/${userId}`;
      return $http.get(requestUrl)
        .then((response) => response, (error) => error);
    },
    // Creates a new covey for this user
    postFriend: (friendData) => {
      const requestUrl = '/api/friends';
      return $http.post(requestUrl, friendData)
        .then((response) => response, (error) => error);
    },
    // Deletes a covey, based on user request
    removeFriend: (friendId) => {
      console.log('removing a friend in friendService');
      const userId = userIdFactory.getUserId();
      const requestUrl = `/api/friends/${userId}/${friendId}`;
      return $http.delete(requestUrl)
        .then((response) => response, (error) => error);
    },
  });
});