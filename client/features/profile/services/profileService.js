const profileServices = angular.module('profile.services', []);

profileServices.service('profileService', function ($http) {
  this.getUser = (userId) => {
    return $http.get(`/api/user/${userId}`)
    .then(
      (response) => response,
      (error) => error
    );
  };

  this.updateUser = (userId, details) => {
    return $http.put(`/api/user/${userId}`, details)
      .then(
        (response) => response,
        (error) => error
      );
  };
});
