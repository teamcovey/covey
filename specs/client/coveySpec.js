describe('Covey Controllers: ', () => {
  beforeEach(module('covey'));

  let $controller;

  beforeEach(inject((_$controller_) => {
    $controller = _$controller_;
  }));

  /* Rides Controller */
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
      $scope.usersRide = { name: 'Test Car' };
      expect($scope.stringifyUsersRide()).to.equal('Test Car');
    });

    it('should expand rides panel to edit mode when clicked', () => {
      $scope.expandRide = false;
      $scope.expandRides();
      expect($scope.expandRide).to.equal(true);
    });
  });


  /* Supplies Controller */
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

    it('should expand supplies panel to edit mode when clicked', () => {
      $scope.expandSupply = false;
      $scope.expandSupplies();
      expect($scope.expandSupply).to.equal(true);
    });
  });
});

