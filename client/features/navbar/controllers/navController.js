angular.module('covey.nav', [])
.controller('navController', function () {
  // Necessary to initialize left side nav at correct height:
  if (window.innerWidth > 770) {
    $('.nav-pills').css('height', '100vh');
  }
});
