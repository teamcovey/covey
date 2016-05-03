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

describe('Routing', () => {
  let $controller;
  let $rootScope
  beforeEach(module('coveys'));

  beforeEach(inject((_$controller_, _$rootScope_) => {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  it('Should toggle coveys by attending status', () => {
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
});
