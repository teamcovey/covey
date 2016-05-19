angular.module('covey.covey', ['date.services'])
.controller('coveyController', function ($scope, $location, coveyService, googleCalendarService, $sce, emailAttendeesService, dateFactory) {
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
    $scope.gMapUrl = $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?'
      + 'key=AIzaSyCYGIGwHNJ8Z7KKpSo6-JdK6t7mYfap05I&'
      + `q=${$scope.details.address} ${$scope.details.city} ${$scope.details.state}`);
  });

  $scope.toggleEdit = () => {
    if ($scope.details.startDate === undefined) {
      $scope.details.startDate = new Date($scope.details.startTime);
      $scope.details.startTimeHours = new Date($scope.details.startTime);
      $scope.details.endDate = new Date($scope.details.endTime);
      $scope.details.endTimeHours = new Date($scope.details.endTime);
    }
      $scope.editDetails = !$scope.editDetails;
  };

  $scope.convertToTextDate = (dateString) => dateFactory.convertToTextDate(new Date(dateString));

  $scope.updateCovey = () => {
    const combinedStartDateTime = new Date(
      $scope.details.startDate.getFullYear(),
      $scope.details.startDate.getMonth(),
      $scope.details.startDate.getDate(),
      $scope.details.startTimeHours.getHours(),
      $scope.details.startTimeHours.getMinutes()
      );
    const combinedEndDateTime = new Date(
      $scope.details.endDate.getFullYear(),
      $scope.details.endDate.getMonth(),
      $scope.details.endDate.getDate(),
      $scope.details.endTimeHours.getHours(),
      $scope.details.endTimeHours.getMinutes()
      );
    $scope.details.startTime = combinedStartDateTime;
    $scope.details.endTime = combinedEndDateTime;
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

  $scope.emailAttendees = () => {
    toggleSpinner(); // spinner on
    console.log('emailMessage: ', $scope.details.email);
    emailAttendeesService.emailAttendees($scope.details, $scope.emailMessage)
      .then((response) => {
        if (response) {
          $scope.details.email = '';
          toggleSpinner(); // spinner off
          toggleSent();
        }
      });
  };

  const toggleSent = () => {
    $scope.emailSentTick = !$scope.emailSentTick;
  };

  const toggleSpinner = () => {
    $scope.spinnerVisible = !$scope.spinnerVisible;
  };

  $scope.setSentFalse = () => {
    $scope.emailSentTick = false;
  };


});
