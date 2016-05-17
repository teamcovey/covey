angular.module('email.services', [])

.service('emailAttendeesService', function ($http, userIdFactory) {
  this.emailAttendees = (details, emailMessage) => {
    const userId = userIdFactory.getUserId();
    const coveyId = details.id;
    const message = JSON.stringify({ emailMessage });
    console.log('in service / message: ', message); // TODO Fix body input
    const requestUrl = `/api/email/${coveyId}/${userId}`;
    console.log(requestUrl);
    return $http.post(requestUrl, message)
      .then(
        (response) => console.log(response),
        (error) => error
      );
  };
});
