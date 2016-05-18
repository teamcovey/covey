angular.module('covey.index', ['ngCookies'])

.controller('indexController', function ($scope, $cookies, indexService) {
  
  //jQuery for page scrolling feature - requires jQuery Easing plugin
  $('a.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top
      }, 1500, 'easeInOutExpo');
      event.preventDefault();
  });

  // document.cookie = 'new_user = false';
  $cookies.remove('new_user');
  $scope.setCookie = () => {
    document.cookie = 'new_user = true';
  };
});
