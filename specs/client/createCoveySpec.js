describe('Create Covey', () => {
  let $controller;
  let $rootScope;
  beforeEach(module('createCovey'));

  beforeEach(inject((_$controller_, _$rootScope_) => {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));
  it('Create modal should not be visible by default', () => {
    const $scope = {};
    const controller = $controller('createCoveyController', { $scope: $scope });
    expect($scope.visible).to.equal(false);
  });
  it('Error modal should not be visible by default', () => {
    const $scope = {};
    const controller = $controller('createCoveyController', { $scope: $scope });
    expect($scope.errorVisible).to.equal(false);
  });
  it('Should toggle visibility of create modal', () => {
    const $scope = {};
    const controller = $controller('createCoveyController', { $scope: $scope });
    $rootScope.$broadcast('toggleCreateCoveyModal');
    expect($scope.visible).to.equal(true);
  });
  it('Should be able to toggle vsisiblity of error modal', () => {
    const $scope = {};
    const controller = $controller('createCoveyController', { $scope: $scope });
    expect($scope.errorVisible).to.equal(false);
    $scope.toggleErrorVisibility();
    expect($scope.errorVisible).to.equal(true);
  });
});