angular.module('covey.rides')
.service('ridesHelpers', function () {
  this.getUsersCar = (rides, user) => {
    let ridingWith = '';
    for (let i = 0; i < rides.length; i++) {
      if (rides[i].passengers.indexOf(user) > -1) {
        ridingWith = `You're riding in ${rides[i].driverName}'s car.`;
        break;
      } else if (rides[i].driverName === user) {
        ridingWith = 'You\'re driving!';
        break;
      }
    }
    return ridingWith;
  };

  this.checkPassenger = (driver, rides) => {
    let isPassenger = null;
    rides.forEach((ride) => {
      if (ride.passengers.indexOf(driver) > -1) {
        isPassenger = ride.id;
      }
    });
    return isPassenger;
  };
})
.service('ridesHttp', function ($http) {
  this.getAllRides = (attendees) => {
    // $http.get(/api/rides/:coveyId)
    return [
      {
        id: 1, covey_id: 1, driverName: attendees[1], timeToLeave: '3PM',
        passengers: [attendees[0], attendees[3]],
      },
      {
        id: 2, covey_id: 1, driverName: 'Freddie', timeToLeave: '3PM',
        passengers: [attendees[2]],
      },
    ];
  };

  this.post = (newRide) => {};
  this.put = (updatedRide) => {};
  this.delete = (ride) => {};

  this.addPassenger = (rideId, userId) => {
    // $http.post({
    //   url: `/api/riders/${rideId}/${userId}`,
    //   data: {
    //     rider: userId,
    //   },
    // });
  };
});
