const testData = [
  {
    name: 'Brochella 2016',
    description: 'Eat, sleep, rave, repeat',
    date: 'April 15th, 2016',
    admin: true,
    attending: true,
    image: '../styles/img/200x200.png',
    id: '12345',
  },
  {
    name: 'Burning man',
    description: 'Hang out with Toben in the desert',
    date: 'August 28th, 2016',
    admin: false,
    attending: true,
    image: '../styles/img/200x200.png',
    id: '12345',
  },
  {
    name: 'Camping at Redwood National and State Park',
    description: 'Drink beer with the bears',
    date: 'July 4th, 2016',
    admin: true,
    attending: true,
    image: '../styles/img/200x200.png',
    id: '12345',
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
    $scope.sortCoveysByAttendingStatus($scope.coveys);
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
