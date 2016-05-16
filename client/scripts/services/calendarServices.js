angular.module('calendar.services', [])

.service('googleCalendarService', function ($http, calendarHelpers, userIdFactory) {
  this.addToCalendar = (details) => {
    const times = calendarHelpers.formatTime(details);
    const userId = userIdFactory.getUserId();
    return calendarHelpers.getUser(userId)
      .then((response) => {
        const name = response;
        window.open(calendarHelpers.makeURL(details, times, name));
      });
  };
})

.service('calendarHelpers', function ($http) {
  this.makeURL = (details, time, name) => {
    const url = 'http://www.google.com/calendar/event?' +
    'action=TEMPLATE' +
    '&text=' + details.name +
    '&dates=' + time.start + '/' + time.end +
    '&details=Added by ' + name + ', using Covey. Join a Covey at mycovey.com' +
    '&location=' + details.location;
    return url.replace(/ /g, '%20');
  };

  this.formatTime = (details) => {
    const times = {};
    times.start = new Date(details.startTime).toISOString().replace(/-|:|\.\d+/g, '');
    times.end = new Date(details.endTime).toISOString().replace(/-|:|\.\d+/g, '');
    return times;
  };

  this.getUser = (userId) => {
    return $http.get(`/api/user/${userId}`)
    .then(
      (response) => response.data.user.firstName,
      (error) => error
    );
  };
});

