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
