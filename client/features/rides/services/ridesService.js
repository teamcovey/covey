angular.module('covey.rides')
.service('ridesHelpers', function ($routeParams) {
  /* Iterates through all rides and finds the user's assigned ride */
  this.getUsersRide = (rides, userId) => {
    let usersRide = { name: 'You don\'t have a ride yet'};

    rides.forEach((ride) => {
      ride.riders.forEach((rider) => {
        if (rider.user_id === userId) {
          usersRide = ride;
        }
      });
    });

    return usersRide;
  };

  /* Creates skeleton ride for easy user input and POSTing */
  this.newRideInput = (userId) => ({
    name: 'add ride',
    seats: 4,
    location: 'The Shire',
    departureTime: 'time',
    covey_id: $routeParams.coveyId,
    coveyId: $routeParams.coveyId,
    userId,
    riders: [],
    driver: {},
  });
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

  this.addRide = (newRide) => {
    return $http.post('/api/rides', newRide)
      .then((response) => response.data, (error) => {
        console.error(error);
      });
  };

  this.updateRide = (updateRide) => {
    return $http.put(`/api/rides/${updateRide.id}`, updateRide)
      .then((response) => response, (error) => {
        console.error(error);
      });
  };

  this.removeRide = (rideId) => {
    return $http.delete(`/api/rides/${rideId}`)
      .then((response) => response, (error) => {
        console.error(error);
      });
  };


  this.addPassenger = (rideId, userId) => {
    return $http.post(`/api/riders/${rideId}/${userId}`, {})
      .then((response) => response, (error) => {
        console.error(error);
      });
  };

  this.removePassenger = (rideId, userId) => {
    return $http.delete(`/api/riders/${rideId}/${userId}`)
      .then((response) => response, (error) => {
        console.error(error);
      });
  };
});