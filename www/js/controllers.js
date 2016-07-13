angular.module('starter.controllers', ['wfangular'])
.filter('wfSearch', function() {
  return ;
})
.controller('MapController', function($scope, wfangular3d, $ionicFilterBar) {
  var filterBarInstance;
  $scope.items = [];
  $scope.showFilterBar = function () {
   filterBarInstance = $ionicFilterBar.show({
     items: $scope.items,
     filter: function(input, keyword) {
       console.log("wfSearch", wfangular3d.search.search(keyword), keyword);
       return wfangular3d.search.search(keyword);
     },
     update: function (filteredItems, filterText) {
       $scope.items = filteredItems;
       if (filterText) {
         console.log("", filterText, filteredItems);
       }
     }
   });

   $scope.showPOI = function(poi){
      $scope.items = [];
      filterBarInstance();
      wfangular3d.showPath(poi.getNode(), poi);
   }
 };

})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
