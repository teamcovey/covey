angular.module('covey.rides', ['userId.services', 'covey.attendees'])
.controller('ridesController', function ($rootScope, $scope, ridesHelpers, ridesHttp, userIdFactory, attendeesHttp, socket, $routeParams) {
  const userId = userIdFactory.getUserId();
  $scope.expandRide = false;
  $scope.ridesDetails = [];
  $scope.usersRide = 'You don\'t have a ride yet.';

  /* Gets all attendees of this event */
  // TODO: trigger this call when attendeesCtrl changes
  attendeesHttp.getAllAttendees()
    .then((response) => {
      $scope.attendees = response;
    });

  /* Gets all rides (& riders) info for current covey,
  *  and sets logged-in user's current ride for display. */
  const init = () => {
    ridesHttp.getAllRides()
      .then((rides) => {
        $scope.ridesDetails = rides;
        $scope.usersRide = ridesHelpers.getUsersRide(rides, userId);
      });
  };

  init();

  /* SOCKETS:add ride */
  socket.on(`add ride ${$routeParams.coveyId}`, (data) => {
    $scope.ridesDetails.push(data.response);
  });

  /* SOCKETS:update ride */
  socket.on(`update ride ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.ridesDetails.length; i++) {
      if ($scope.ridesDetails[i].carId === data.response.carId) {
        $scope.ridesDetails[i] = data.response;
        break;
      }
    }
    $scope.usersRide = ridesHelpers.getUsersRide($scope.ridesDetails, userId);
  });

  /* SOCKETS:remove ride */
  socket.on(`remove ride ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.ridesDetails.length; i++) {
      if ($scope.ridesDetails[i].carId.toString() === data.response.toString()) {
        $scope.ridesDetails.splice(i, 1);
        break;
      }
    }
    $scope.usersRide = ridesHelpers.getUsersRide($scope.ridesDetails, userId);
  });

  /* SOCKETS:add rider */
  socket.on(`add rider ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.ridesDetails.length; i++) {
      if ($scope.ridesDetails[i].carId.toString() === data.response.carId.toString()) {
        for (let j = 0; j < $scope.attendees.length; j++) {
          if ($scope.attendees[j].userId.toString() === data.response.userId.toString()) {
            if ($scope.ridesDetails[i].riders) {
              $scope.ridesDetails[i].riders.push($scope.attendees[j]);
            } else {
              $scope.ridesDetails[i].riders = [$scope.attendees[j]];
            }

            // If current user is the added rider, set ride to user's ride assignment
            if (data.response.userId.toString() === userId.toString()) {
              $scope.usersRide = ridesHelpers.getUsersRide($scope.ridesDetails, userId);
            }
            break;
          }
        }
      }
    }
    $scope.usersRide = ridesHelpers.getUsersRide($scope.ridesDetails, userId);
  });

  /* SOCKETS:remove rider */
  socket.on(`remove rider ${$routeParams.coveyId}`, (data) => {
    for (let i = 0; i < $scope.ridesDetails.length; i++) {
      if ($scope.ridesDetails[i].carId.toString() === data.response.carId.toString()) {
        // iterate over ridesDetails and find one that matches rideId; splice out the data.userId from that riders
        for (let j = 0; j < $scope.ridesDetails[i].riders.length; j++) {
          const riderId = $scope.ridesDetails[i].riders[j].userId;
          if (riderId.toString() === data.response.userId.toString()) {
            $scope.ridesDetails[i].riders.splice(j, 1);
            if (data.response.userId.toString() === userId.toString()) {
              $scope.usersRide = ridesHelpers.getUsersRide($scope.ridesDetails, userId);
            }
            break;
          }
        }
      }
    }
    $scope.usersRide = ridesHelpers.getUsersRide($scope.ridesDetails, userId);
  });

  /* Displays user's current ride */
  $scope.stringifyUsersRide = () => {
    return $scope.usersRide.name;
  };

  /* Toggle edit mode visibility */
  $scope.expandRides = () => {
    $scope.expandRide = !$scope.expandRide;
  };

  $scope.addNewRide = () => {
    ridesHttp.addRide(ridesHelpers.newRideInput());
  };

  /* Creates or updates a ride when user select 'Update' in edit view */
  $scope.submitRide = (ride) => {
    ridesHttp.updateRide(ride);
  };

  $scope.removeRide = (ride) => {
    ridesHttp.removeRide(ride.carId);
  };

  $scope.addPassenger = (passenger, ride) => {
    const passengerId = passenger.userId;
    ridesHttp.addPassenger(ride.carId, passengerId);
  };

  $scope.removePassenger = (passenger, ride) => {
    const passengerId = passenger.userId;
    ridesHttp.removePassenger(ride.carId, passengerId);
  };
});
