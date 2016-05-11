angular.module('covey.chat', ['firebase'])
.controller('chatController', function ($rootScope, $scope, chatFirebase, $firebaseObject, $firebaseArray) {
  const ref = new Firebase(chatFirebase.getRoute('https://amber-heat-3768.firebaseio.com/'));
  // download the data into a local object
  // const syncObject = $firebaseArray(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
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
      console.log('boom goes the dynamite', userName.user[0]);

      $scope.chatName = userName.user[0].firstName + ' ' + userName.user[0].lastName.slice(0, 1) + '.';
    });
  };

  init();

  // $scope.addChat = (newChatId) => {
  //   chatsHttp.addChat(newChatId).then((response) => {
  //     if (!response.user.user_id) {
  //       response.user.user_id = response.user.id;
  //     }
  //     console.log('Added Chat id: ', response.user.user_id);
  //     $scope.chats.push(response.user);
  //   });
  //   $scope.newChat = '';
  // };

  // $scope.removeChat = (chat) => {
  //   chatsHttp.removechat(chat.user_id)
  //     .then((response) => {
  //       console.log('Removed chat id: ', chat.user_id);
  //       $scope.chats.splice($scope.chats.indexOf(chat), 1);
  //     }, (error) => {
  //       console.error(error);
  //     });
  // };
});
