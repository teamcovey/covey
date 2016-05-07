angular.module('covey.attendees')
.service('attendeesHttp', function ($http, $routeParams) {
  this.getAllAttendees = () => {
    return $http.get(`/api/users/${$routeParams.coveyId}`)
    .then((users) => users.data, (error) => {
      console.error(error);
    });
  };

  this.addAttendee = (attendeeId) => {
    return $http.post(`/api/coveys/${$routeParams.coveyId}/${attendeeId}`, {})
    .then((response) => response.data, (error) => {
      console.error(error);
    });
  };

  this.removeAttendee = (attendeeId) => {
    return $http.delete(`/api/coveys/${$routeParams.coveyId}/${attendeeId}`)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };
});
