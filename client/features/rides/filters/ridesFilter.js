/* Filters attendees data so only possible passengers
* can be displayed as options to be added to rides */

angular.module('covey.rides')
.filter('alreadyPassenger', function () {
  return (attendees, rides) => {
    if (Array.isArray(attendees)) {
      let allPassengers = [];
      rides.forEach((ride) => {
        allPassengers = allPassengers.concat(ride.riders);
      });
      return attendees.filter((attendee) => {
        const attendeeId = attendee.userId;
        let result = true;
        allPassengers.forEach((currentPassenger) => {
          if (currentPassenger) {
            const passengerId = currentPassenger.userId;
            if (currentPassenger && passengerId === attendeeId) {
              result = false;
            }
          }
        });
        return result;
      });
    }
  };
})
.filter('unique', function() {
  return _.memoize(function (arr, field) {
    return _.uniq(arr, function(a) { 
      return a[field]; 
    });
  });
});
