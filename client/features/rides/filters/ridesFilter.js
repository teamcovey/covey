/* Filters attendees data so only possible passengers
* can be displayed as options to be added to rides */

angular.module('covey.rides')
.filter('alreadyPassenger', function () {
  return _.memoize((attendees, rides) => {
    if (Array.isArray(attendees)) {
      let allPassengers = [];
      rides.forEach((ride) => {
        allPassengers = allPassengers.concat(ride.riders);
      });
      return attendees.filter((attendee) => {
        let result = true;
        allPassengers.forEach((currentPassenger) => {
          if (currentPassenger.user_id === attendee.user_id) {
            result = false;
          }
        });
        return result;
      });
    }
  });
});
