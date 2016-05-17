const testData = [
  {
    name: 'Brochella 2016',
    blurb: 'Eat, sleep, rave, repeat',
    startTime: new Date(2016, 5, 15),
    endTime: new Date(2016, 5, 16),
    isOwner: false,
    photoUrl: '../styles/img/200x200.png',
    covey_id: '123',
  },
  {
    name: 'Burning man',
    blurb: 'Hang out with Toben in the desert',
    startTime: new Date(2016, 5, 15),
    endTime: new Date(2016, 5, 16),
    isOwner: true,
    photoUrl: '../styles/img/200x200.png',
    covey_id: '12345',
  },
  {
    name: 'Camping at Redwood National and State Park',
    blurb: 'Drink beer with the bears',
    startTime: new Date(2016, 4, 4),
    endTime: new Date(2016, 4, 7),
    isOwner: true,
    photoUrl: '../styles/img/200x200.png',
    covey_id: '12345',
  },
];

describe('Coveys', () => {
  let $controller;
  let $rootScope;
  let $location;
  beforeEach(module('coveys'));

  beforeEach(inject((_$controller_, _$rootScope_, _$location_) => {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
  }));

  it('Should sort coveys by attending status and date', () => {
    const $scope = {};
    const controller = $controller('coveysController', { $scope: $scope });
    $scope.coveys = testData;
    expect($scope.coveys[0].name).to.equal('Brochella 2016');
    $scope.sortCoveysByOwnershipAndDate($scope.coveys);
    expect($scope.coveys[0].name).to.equal('Camping at Redwood National and State Park');
    expect($scope.coveys[2].name).to.equal('Brochella 2016');
  });
  it('hasCoveys should be false by default', () => {
    const $scope = {};
    const controller = $controller(('coveysController'), { $scope: $scope });
    expect($scope.hasCoveys).to.equal('false');
  });
  it('Should navigate to new covey page on click', () => {
    const $scope = {};
    const controller = $controller(('coveysController'), { $scope: $scope });
    expect($location.path()).to.equal('');
    $scope.goToCovey({covey_id: 12345});
    expect($location.path()).to.equal('/coveys/12345');
  });
  it('Should broadcast to the rootscope when clicking creat covey button', (done) => {
    const $scope = {};
    const controller = $controller(('coveysController'), { $scope: $scope });
    $rootScope.$on('toggleCreateCoveyModal', () => {
      expect(true).to.equal(true);
      done();
    });
    $scope.toggleCreateCoveyModal();
  });
  it('Should toggle delete confirmation view', () => {
    const $scope = {};
    const fakeEvent = { stopPropagation: () => {} };
    const fakeCovey = { confirmDelete: false };
    const controller = $controller(('coveysController'), { $scope: $scope });

    expect(fakeCovey.confirmDelete).to.equal(false);
    $scope.confirmDeletion(fakeCovey, fakeEvent);
    expect(fakeCovey.confirmDelete).to.equal(true);
  });
  it('Should delete covey from the array when deleteCovey is called', () => {
    const $scope = {};
    const fakeEvent = { stopPropagation: () => {} };
    const controller = $controller(('coveysController'), { $scope: $scope });
    $scope.coveys = testData;

    expect($scope.coveys.length).to.equal(3);
    expect($scope.coveys[0].name).to.equal('Camping at Redwood National and State Park');
    expect($scope.coveys[1].name).to.equal('Burning man');

    $scope.deleteCovey($scope.coveys[0], fakeEvent);

    expect($scope.coveys.length).to.equal(2);
    expect($scope.coveys[0].name).to.equal('Burning man');
    expect($scope.coveys[1].name).to.equal('Brochella 2016');
  });
});
