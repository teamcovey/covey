const coveys = angular.module('coveys', []);

coveys.controller('coveysController', ($scope) => {
  $scope.hasEvents = false;

  const getEvents = () => {
    // TODO: Implement after creating events service
  };

  getEvents();
});