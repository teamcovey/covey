/* Filters attendees data so only possible passengers
* can be displayed as options to be added to rides */

angular.module('covey.rides')
.filter('alreadyPassenger', function () {
  return (attendees, rides) => {
    let allPassengers = [];
    rides.forEach((ride) => {
      allPassengers = allPassengers.concat(ride.passengers).concat(ride.driverName);
    });
    return attendees.filter((passenger) => (
      allPassengers.indexOf(passenger) === -1
    ));
  };
});
