angular.module('covey.chat')
.service('chatFirebase', function ($http, userIdFactory, $routeParams) {

  this.getUserName = () => {
    const userId = userIdFactory.getUserId();
    return $http.get(`/api/username/${userId}`, {})
    .then((response) => response.data, (error) => {
      console.error(error);
    });
  };

  this.getRoute = (base) => base.concat($routeParams.coveyId);
});
