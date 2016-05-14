const profileServices = angular.module('profile.services', []);

profileServices.service('profileService', function ($http) {
  this.getUser = (userId) => {
    return $http.get(`/api/user/${userId}`)
    .then(
      (response) => response,
      (error) => error
    );
  };
});
