angular.module('email.services', [])

.service('emailAttendeesService', function ($http, userIdFactory) {
  this.emailAttendees = (details) => {
    console.log(details);
    const userId = userIdFactory.getUserId();
    const coveyId = details.coveyId;
    const message = JSON.stringify({
      email: details.email,
      name: details.name,
    });
    const requestUrl = `/api/email/${coveyId}/${userId}`;
    return $http.post(requestUrl, message)
      .then(
        (response) => response,
        (error) => error
      );
  };
});
