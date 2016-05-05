/* Filters attendees data so only possible passengers
* can be displayed as options to be added to rides */

angular.module('covey.rides')
.filter('alreadyPassenger', function () {
  return (attendees, rides) => {
    console.log('ALL :', attendees);
    let allPassengers = [];
    rides.forEach((ride) => {
      console.log('EACH RIDE: ', ride);
      allPassengers = allPassengers.concat(ride.passengers);
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
  };
});
