angular.module('covey.covey', [])
.controller('coveyController', function ($scope, $location, coveyService, googleCalendarService, $sce, emailAttendeesService) {
  // Necessary to initialize left side nav & columns at correct height/width:
  if (window.innerWidth > 770) {
    $('.covey').css('width', '97%');
  }

  $(window).resize(() => {
    if (window.innerWidth > 770) {
      $('ul.nav-pills').css('height', '100vh');
      $('.covey').css('width', '97%');
    } else {
      $('ul.nav-pills').css('height', '');
      $('.covey').css('width', '');
    }
  });

  coveyService.getCovey().then((response) => {
    $scope.details = response.covey;
    // TODO: add validation to check that photoUrl is a real url:
    $scope.gMapUrl = $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?'
      + 'key=AIzaSyCYGIGwHNJ8Z7KKpSo6-JdK6t7mYfap05I&'
      + `q=${$scope.details.address} ${$scope.details.city} ${$scope.details.state}`);
    $scope.showPhoto = response.covey.photoUrl || false;
  });

  $scope.toggleEdit = () => {
    $scope.editDetails = !$scope.editDetails;
  };

  $scope.formatDate = (dateToFormat) => {
    if (dateToFormat && dateToFormat.toString().length) {
      return new Date(dateToFormat).toString().slice(0, 21);
    }
    return '';
  };

  $scope.updateCovey = () => {
    coveyService.updateCovey($scope.details);
    // TODO: add validation to check that photoUrl is a real url:
    $scope.gMapUrl = $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?'
      + 'key=AIzaSyCYGIGwHNJ8Z7KKpSo6-JdK6t7mYfap05I&'
      + `q=${$scope.details.address} ${$scope.details.city} ${$scope.details.state}`);
    $scope.showPhoto = $scope.details.photoUrl || false;
  };

  $scope.addToCalendar = () => {
    googleCalendarService.addToCalendar($scope.details);
  };

  $scope.emailMessage = 'this';

  $scope.emailAttendees = () => {
    emailAttendeesService.emailAttendees($scope.details, $scope.emailMessage);
  };
});
