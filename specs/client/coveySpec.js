describe('Covey Controllers: ', () => {
  beforeEach(module('covey'));

  let $controller;

  beforeEach(inject((_$controller_) => {
    $controller = _$controller_;
  }));

  describe('attendeesController', () => {
    let $scope;
    let controller;

    beforeEach(() => {
      $scope = {};
      $scope.details = {
        attendees: ['Freddie Ryder', 'Rahim Dharssi', 'Toben Green', 'Skye Free'],
      };
      $scope.supplies = {
        supplies: [
          {
            id: 1, covey_id: 1, supplyName: 'Beer', suppliers: [$scope.details.attendees[2], $scope.details.attendees[0]],
          },
          {
            id: 2, covey_id: 1, supplyName: 'Chips', suppliers: [$scope.details.attendees[2]],
          },
        ],
      };
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
      $scope.checkPassenger = (driver) => {
        let isPassenger = null;
        $scope.rides.rides.forEach((ride) => {
          if (ride.passengers.indexOf(driver) > -1) {
            isPassenger = ride.id;
          }
        });
        return isPassenger;
      };
      $scope.removePassenger = (passenger, ride) => {
        $scope.rides.rides[ride.id - 1].passengers.forEach((currentPassenger, index) => {
          if (currentPassenger === passenger) {
            $scope.rides.rides[ride.id - 1].passengers.splice(index, 1);
          }
        });
      };
      let controller = $controller('attendeesController', { $scope });
    });

    it('should add friend to covey attendees list', () => {
      const newFriend = 'John Smith';
      $scope.addFriend(newFriend);
      const length = $scope.details.attendees.length;
      expect($scope.details.attendees[length - 1]).to.equal(newFriend);
    });

    it('should add multiple friends to covey attendees list', () => {
      const newFriends = 'John Smith,Johnny Appleseed';
      $scope.addFriend(newFriends);
      const length = $scope.details.attendees.length;
      expect($scope.details.attendees[length - 1]).to.equal('Johnny Appleseed');
    });

    it('should remove friend from covey attendees list', () => {
      const newFriend = 'John Smith';
      $scope.addFriend(newFriend);
      $scope.removeFriend(newFriend);
      const length = $scope.details.attendees.length;
      expect($scope.details.attendees[length - 1]).to.equal('Skye Free');
    });

    it('should remove uninvited attendee from all other lists', () => {
      const removed = 'Toben Green';
      $scope.removeFriend(removed);
      expect($scope.rides.rides[1].passengers.indexOf(removed)).to.equal(-1);
      expect($scope.supplies.supplies[0].suppliers.indexOf(removed)).to.equal(-1);
      expect($scope.supplies.supplies[1].suppliers.indexOf(removed)).to.equal(-1);
    });
  });

  describe('ridesController', () => {
    let $scope;
    let controller;

    beforeEach(() => {
      $scope = {};
      $scope.details = {
        attendees: ['Freddie Ryder', 'Rahim Dharssi', 'Toben Green', 'Skye Free'],
      };
      let controller = $controller('ridesController', { $scope });
    });

    it('should display driver for car current user is riding in', () => {
      $scope.user = 'Toben Green';
      expect($scope.getUsersCar()).to.equal('You\'re riding in Freddie\'s car.');
    });

    it('should say "Youre driving" if current user is a driver', () => {
      $scope.user = 'Rahim Dharssi';
      expect($scope.getUsersCar()).to.equal('You\'re driving!');
    });

    it('should expand rides panel to edit mode when clicked', () => {
      $scope.expandRide = false;
      $scope.expandRides();
      expect($scope.expandRide).to.equal(true);
    });

    it('should push placeholder to ride array when new ride button is clicked', () => {
      $scope.addNewRide();
      const length = $scope.rides.rides.length;
      expect(length).to.equal(3);
      expect($scope.rides.rides[length - 1].driverName).to.equal('driver');
    });

    it('should add new ride to rides array', () => {
      const newRide = {
        id: $scope.rides.rides.length + 1,
        covey_id: 1,
        driverName: 'Skye',
        timeToLeave: '6PM',
        passengers: 'John Smith',
      };
      $scope.submitRide(newRide);
      const length = $scope.rides.rides.length;
      expect(length).to.equal(3);
      expect($scope.rides.rides[length - 1].driverName).to.equal('Skye');
    });

    it('should remove passenger from passengers lists if a passenger becomes a driver', () => {
      const newRide = {
        id: $scope.rides.rides.length + 1,
        covey_id: 1,
        driverName: 'Skye Free',
        timeToLeave: '6PM',
        passengers: 'John Smith',
      };
      $scope.submitRide(newRide);
      const length = $scope.rides.rides.length;
      expect(length).to.equal(3);
      expect($scope.rides.rides[length - 1].driverName).to.equal('Skye Free');
      expect($scope.rides.rides[0].passengers.join('')).to.equal(['Freddie Ryder'].join(''));
    });

    it('should delete ride from rides array', () => {
      const ride = {
        id: 2,
      };
      $scope.deleteRide(ride);
      const length = $scope.rides.rides.length;
      expect(length).to.equal(1);
      expect($scope.rides.rides[length - 1].driverName).to.equal('Rahim Dharssi');
    });

    it('should add new passenger to ride\'s passengers', () => {
      const newPassenger = $scope.details.attendees[2];
      $scope.addPassenger(newPassenger, { id: 1 });
      expect($scope.rides.rides[0].passengers.indexOf(newPassenger)).to.not.equal(-1);
    });

    it('should remove passenger from ride\'s passengers', () => {
      const passenger = $scope.details.attendees[2];
      $scope.addPassenger(passenger, { id: 1 });
      $scope.removePassenger(passenger, { id: 1 });
      expect($scope.rides.rides[0].passengers.indexOf(passenger)).to.equal(-1);
    });
  });

  describe('suppliesController', () => {
    let $scope;
    let controller;

    beforeEach(() => {
      $scope = {};
      $scope.details = {
        attendees: ['Freddie Ryder', 'Rahim Dharssi', 'Toben Green', 'Skye Free'],
      };
      let controller = $controller('suppliesController', { $scope });
    });

    it('should display responsibilities for current user', () => {
      $scope.user = 'Toben Green';
      expect($scope.getUsersResponsibilities()).to.equal('Beer, Chips');
    });

    it('should expand supplies panel to edit mode when clicked', () => {
      $scope.expandSupply = false;
      $scope.expandSupplies();
      expect($scope.expandSupply).to.equal(true);
    });

    it('should push placeholder to supply panel when add supply button is clicked', () => {
      $scope.addNewSupply();
      const length = $scope.supplies.supplies.length;
      expect(length).to.equal(3);
      expect($scope.supplies.supplies[length - 1].supplyName).to.equal('supply');
    });

    it('should submit new supply data to supplies panel', () => {
      const newSupply = {
        id: $scope.supplies.supplies.length + 1,
        covey_id: 1,
        supplyName: 'Guacamole',
        suppliers: $scope.details.attendees[1],
      };
      $scope.submitSupply(newSupply);
      const length = $scope.supplies.supplies.length;
      expect(length).to.equal(3);
      expect($scope.supplies.supplies[length - 1].supplyName).to.equal('Guacamole');
    });

    it('should delete supply from supplies array', () => {
      const supply = {
        id: 2,
      };
      $scope.deleteSupply(supply);
      const length = $scope.supplies.supplies.length;
      expect(length).to.equal(1);
      expect($scope.supplies.supplies[length - 1].supplyName).to.equal('Beer');
    });

    it('should add new supplier to supply\'s suppliers', () => {
      const newSupplier = $scope.details.attendees[1];
      $scope.addSupplier(newSupplier, { id: 1 });
      expect($scope.supplies.supplies[0].suppliers.indexOf(newSupplier)).to.not.equal(-1);
    });

    it('should remove supplier from supply\'s suppliers', () => {
      const supplier = $scope.details.attendees[1];
      $scope.addSupplier(supplier, { id: 1 });
      $scope.removeSupplier(supplier, { id: 1 });
      expect($scope.supplies.supplies[0].suppliers.indexOf(supplier)).to.equal(-1);
    });
  });
});
