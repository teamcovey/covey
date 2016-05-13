angular.module('auth.services', [])

.factory('auth', function (userIdFactory, $http) {
  return ({
    checkAuthentication: () => {
      const userId = userIdFactory.getUserId();
      return $http.get(`/api/coveys/${userId}`)
        .then((response) => response.status !== 401, () => false);
    },
  });
});
