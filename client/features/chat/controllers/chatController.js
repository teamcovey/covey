angular.module('covey.chat', ['firebase'])
.controller('chatController', function ($rootScope, $scope, chatFirebase, $firebaseArray) {
  const ref = new Firebase(chatFirebase.getRoute('https://amber-heat-3768.firebaseio.com/'));
  $scope.messages = $firebaseArray(ref);

  // ADD MESSAGE METHOD
  $scope.addMessage = (e) => {
    // LISTEN FOR RETURN KEY
    if (e.keyCode === 13 && $scope.msg) {
      // ALLOW CUSTOM OR ANONYMOUS USER NAMES
      let name = $scope.chatName || 'goober';
      $scope.messages.$add({ from: name, body: $scope.msg });
      // RESET MESSAGE
      $scope.msg = '';
    }
  };

  const init = () => {
    chatFirebase.getUserName().then((userName) => {
      $scope.chatName = userName.user[0].firstName + ' ' + userName.user[0].lastName.slice(0, 1) + '.';
    });
  };

  init();
});
