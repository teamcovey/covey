angular.module('covey.chat')
.service('chatFirebase', function ($http, userIdFactory, $routeParams) {
  // this.getAllChats = () => {
  //   // should do the firebase side of returning chat stuff.
  //   return $http.get(`/api/users/${$routeParams.coveyId}`)
  //   .then((users) => users.data, (error) => {
  //     console.error(error);
  //   });
  // };

  this.getUserName = () => {
    const userId = userIdFactory.getUserId();
    return $http.get(`/api/username/${userId}`, {})
    .then((response) => response.data, (error) => {
      console.error(error);
    });
  };

  this.getRoute = (base) => base.concat($routeParams.coveyId);

});
