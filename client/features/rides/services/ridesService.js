angular.module('covey.rides')
.service('ridesHelpers', function () {
  // this.getUsersRide = (ride) => {
  //   let ridingWith = 'No rides organized yet.';
  //   // for (let i = 0; i < rides.length; i++) {
  //   //   console.log('RIDE OBJECT: ', rides[i]);
  //   //   if (rides[i].passengers.indexOf(user) > -1) {
  //   //     ridingWith = `You're riding in ${rides[i].driverName}'s car.`;
  //   //     break;
  //   //   } else if (rides[i].driverName === user) {
  //   //     ridingWith = 'You\'re driving!';
  //   //     break;
  //   //   }
  //   // }
  //   return ridingWith;
  // };

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
.service('ridesHttp', function ($http, $routeParams) {
  this.getAllRides = () => {
    return $http.get(`/api/rides/${$routeParams.coveyId}`)
    .then((rides) => rides.data, (error) => {
      console.error(error);
    });
  };

  this.getAllRiders = (rideId) => {
    return $http.get(`/api/riders/${rideId}`)
    .then((riders) => riders.data, (error) => {
      console.error(error);
    });
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
