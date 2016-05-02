angular.module('covey.rides', [])
.filter('alreadyPassenger', function () {
  return (attendees, rides) => {
    let allPassengers = [];
    rides.forEach((ride) => {
      allPassengers = allPassengers.concat(ride.passengers);
    });
    return attendees.filter((passenger) => (
      allPassengers.indexOf(passenger) === -1
    ));
  };
})
.controller('ridesController', function ($scope) {
  // TODO: GET rides table details for covey_id (can access to covey $scope.details)
  $scope.rides = {
    rides: [
      {
        id: 1, covey_id: 1, driverName: 'Rahim', timeToLeave: '3PM',
        passengers: [$scope.details.attendees[0], $scope.details.attendees[3]],
      },
      {
        id: 2, covey_id: 1, driverName: 'Freddie', timeToLeave: '3PM',
        passengers: [$scope.details.attendees[1], $scope.details.attendees[2]],
      },
    ],
  };

  $scope.expandRide = false;

  $scope.getUsersCar = () => {
    const rides = $scope.rides.rides;
    let ridingWith = '';
    for (let i = 0; i < rides.length; i++) {
      if (rides[i].passengers.indexOf($scope.user) > -1) {
        ridingWith = rides[i].driverName;
        break;
      }
    }
    return ridingWith;
  };

  $scope.addNewRide = () => {
    $scope.rides.rides.push({
      id: $scope.rides.rides.length + 1,
      covey_id: 1,
      driverName: 'driver',
      timeToLeave: 'when',
      passengers: [],
    });
  };
  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  $scope.submitRide = (ride) => {
    // make PUT or POST request to add/update ride
    $scope.rides.rides[ride.id - 1] = {
      id: ride.id,
      covey_id: 1,
      driverName: ride.driverName,
      timeToLeave: ride.timeToLeave,
      passengers: ride.passengers,
    };
  };

  $scope.deleteRide = (ride) => {
    $scope.rides.rides.splice(ride.id - 1, 1);
    // make PUT or DEL request to update supply
    $scope.rides.rides.forEach((currentRide, index) => {
      currentRide.id = index + 1;
    });
  };

  $scope.addPassenger = (passenger, ride) => {
    $scope.rides.rides[ride.id - 1].passengers.push(passenger);
  };

  $scope.removePassenger = (passenger, ride) => {
    $scope.rides.rides[ride.id - 1].passengers.forEach((currentPassenger, index) => {
      if (currentPassenger === passenger) {
        $scope.rides.rides[ride.id - 1].passengers.splice(index, 1);
      }
    });
  };
});
