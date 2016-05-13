angular.module('welcome.services', [])

.service('welcomeService', function ($http) {
  this.getUser = (userId) => {
    return $http.get(`/api/user/${userId}`)
    .then(
      (response) => response.data.user.firstName,
      (error) => error
    );
  };

  this.getVerificationCode = (tel) => {
    return $http.get(`/api/tel/verify/${tel}`)
    .then(
      (response) => response,
      (error) => error
    );
  };

  this.saveTel = (tel) => {
    return $http.post('api/tel/', { tel })
    .then(
      (response) => response,
      (error) => error
    );
  };

  this.hasTel = () => {
    return $http.get('api/tel/')
      .then(
        (response) => response,
        (error) => error
      );
  };
});
