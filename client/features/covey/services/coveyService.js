angular.module('covey.covey')
.service('coveyService', function ($http) {
  this.getUser = () => 'Skye Free';

  this.getCovey = () => {
    return {
      id: 1,
      eventName: 'Camping With Friends',
      time: '6PM',
      location: 'Yosemite, CA',
      attendees: ['Freddie Ryder', 'Rahim Dharssi', 'Toben Green', 'Skye Free'],
    };
  };

  this.updateCovey = (covey) => {
    $http.put('', covey)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };
});
