describe('Covey Controllers: ', () => {
  beforeEach(module('covey'));

  let $controller;

  beforeEach(inject((_$controller_) => {
    $controller = _$controller_;
  }));

  describe('coveyController', () => {
    let $scope;
    let controller;

    beforeEach(() => {
      $scope = {};
      let controller = $controller('coveyController', { $scope: $scope });
    });

    it('sets the grad to strong if username is longer than 6 chars', () => {
      $scope.testingUser = 'longerthansix';
      $scope.testUser();
      expect($scope.grade).to.equal('strong');
    });
  });

  describe('attendeesController', () => {
    let $scope;
    let controller;

    beforeEach(() => {
      $scope = {};
      $scope.details = {
        attendees: ['Freddie Ryder', 'Rahim Dharssi', 'Toben Green', 'Skye Free'],
      };
      let controller = $controller('attendeesController', { $scope: $scope });
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
  });

  describe('ridesController', () => {
    let $scope;
    let controller;

    beforeEach(() => {
      $scope = {};
      $scope.details = {
        attendees: ['Freddie Ryder', 'Rahim Dharssi', 'Toben Green', 'Skye Free'],
      };
      let controller = $controller('ridesController', { $scope: $scope });
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

    it('should delete ride from rides array', () => {
      const ride = {
        id: 2,
      };
      $scope.deleteRide(ride);
      const length = $scope.rides.rides.length;
      expect(length).to.equal(1);
      expect($scope.rides.rides[length - 1].driverName).to.equal('Rahim');
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
});
