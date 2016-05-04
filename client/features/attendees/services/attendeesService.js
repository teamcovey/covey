angular.module('covey.attendees')
.service('attendeesHelpers', function () {
  this.removePassenger = (attendee, coveyId) => {};
  this.removeSupplier = (attendee, coveyId) => {};
})
.service('attendeesHttp', function ($http) {
  this.addAttendee = (attendee, coveyId) => {
    $http.post(`/api/coveys/${coveyId}`, attendee)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };

  this.removeAttendee = (attendee, coveyId) => {
    $http.delete(`/api/coveys/${coveyId}/${attendee.id}`)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };
});
