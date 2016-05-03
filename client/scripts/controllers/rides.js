angular.module('covey.rides', [])
.controller('ridesController', function ($scope) {
  // TODO: use factory function to GET rides details for covey_id (can access via $scope.details)
  $scope.rides = {
    rides: [
      {
        id: 1, covey_id: 1, driverName: $scope.details.attendees[1], timeToLeave: '3PM',
        passengers: [$scope.details.attendees[0], $scope.details.attendees[3]],
      },
      {
        id: 2, covey_id: 1, driverName: 'Freddie', timeToLeave: '3PM',
        passengers: [$scope.details.attendees[2]],
      },
    ],
  };

  $scope.expandRide = false;

  $scope.getUsersCar = () => {
    const rides = $scope.rides.rides;
    let ridingWith = '';
    for (let i = 0; i < rides.length; i++) {
      if (rides[i].passengers.indexOf($scope.user) > -1) {
        ridingWith = `You're riding in ${rides[i].driverName}'s car.`;
        break;
      } else if (rides[i].driverName === $scope.user) {
        ridingWith = 'You\'re driving!';
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

  $scope.checkPassenger = (driver) => {
    let isPassenger = null;
    $scope.rides.rides.forEach((ride) => {
      if (ride.passengers.indexOf(driver) > -1) {
        isPassenger = ride.id;
      }
    });
    return isPassenger;
  };

  $scope.submitRide = (ride) => {
    // make PUT or POST request to add/update ride
    const isPassenger = $scope.checkPassenger(ride.driverName);
    if (isPassenger !== null) $scope.removePassenger(ride.driverName, { id: isPassenger });

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
})
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
