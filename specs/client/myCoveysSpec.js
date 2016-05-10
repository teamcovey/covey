const testData = [
  {
    name: 'Brochella 2016',
    blurb: 'Eat, sleep, rave, repeat',
    startTime: 'April 15th, 2016',
    endTime: 'April 17th, 2016',
    isOwner: true,
    photoUrl: '../styles/img/200x200.png',
    covey_id: '123',
  },
  {
    name: 'Burning man',
    blurb: 'Hang out with Toben in the desert',
    startTime: 'August 28th, 2016',
    endTime: 'August 30th, 2016',
    isOwner: false,
    photoUrl: '../styles/img/200x200.png',
    covey_id: '12345',
  },
  {
    name: 'Camping at Redwood National and State Park',
    blurb: 'Drink beer with the bears',
    startTime: 'July 4th, 2016',
    endTime: 'July 7th, 2016',
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

  it('Should sort coveys by attending status', () => {
    const $scope = {};
    const controller = $controller('coveysController', { $scope: $scope });
    $scope.coveys = testData;
    expect($scope.coveys[1].name).to.equal('Burning man');
    $scope.sortCoveysByOwnershipStatus($scope.coveys);
    expect($scope.coveys[1].name).to.equal('Camping at Redwood National and State Park');
  });
  it('hasCoveys should be true by default', () => {
    const $scope = {};
    const controller = $controller(('coveysController'), { $scope: $scope });
    expect($scope.hasCoveys).to.equal('true');
  });
  it('Should navigate to new covey page on click', () => {
    const $scope = {};
    const controller = $controller(('coveysController'), { $scope: $scope });
    expect($location.path()).to.equal('');
    $scope.goToCovey(12345);
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
});
