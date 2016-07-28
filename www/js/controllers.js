angular.module('app.controllers', ['wfangular', 'ngCordova'])
.filter('wfSearch', function() {
  return ;
})
.controller('MapController', function($scope, wfangular3d, $ionicFilterBar, $stateParams) {
  var _poi = $stateParams.poi;
  var filterBarInstance;
  $scope.items = [];

  console.log("poi", _poi);
  if(_poi){

    var poi = wfangular3d.pois[_poi];
    if(poi)
      wfangular3d.showPath(poi.getNode(), poi);
  }

  $scope.showFilterBar = function () {
   filterBarInstance = $ionicFilterBar.show({
     items: $scope.items,
     filter: function(input, keyword) {
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
.controller('TabsController', ['$scope', 'wfangular3d', '$stateParams', '$rootScope', '$cordovaSplashscreen', '$ionicPlatform', '$cordovaBeacon', function($scope, wayfinder, $stateParams, $rootScope, $cordovaSplashscreen, $cordovaBeacon,  $ionicPlatform) {
  $scope.$on("$ionicView.afterEnter", function(event, data){
     // Pause Wayfinder when leaving the map tab
     if(wayfinder && wayfinder.engine){
        if(data.stateId == "tab.map"){
          wayfinder.engine.run();
        }  
        else
          wayfinder.engine.pause();
     }
  });

  function createBeacon() {

    var uuid = 'EBEFD083-70A2-47C8-9837-E7B5634DF524'; // mandatory
    var identifier = 'beaconAtTheMacBooks'; // mandatory
    var minor = 4; // optional, defaults to wildcard if left empty
    var major = 1; // optional, defaults to wildcard if left empty

    // throws an error if the parameters are not valid
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

    return beaconRegion;   
  } 

  ionic.Platform.ready(function(){
    var beaconRegion = createBeacon();
    var delegate = new cordova.plugins.locationManager.Delegate();
    
    delegate.didDetermineStateForRegion = function (pluginResult) {
      console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
    };

    delegate.didStartMonitoringForRegion = function (pluginResult) {
        console.log('didStartMonitoringForRegion:'+ JSON.stringify(pluginResult));
    };

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
    };

    delegate.didEnterRegion = function (result) {
        console.log("didEnterRegion "+JSON.stringify(result))
        delegate.requestStateForRegion(beaconRegion)
    };

    delegate.didExitRegion = function (result) {
      console.log("didExitRegion")
    };

    cordova.plugins.locationManager.isBluetoothEnabled()
    .then(function(isEnabled){
      if(!isEnabled){
        cordova.plugins.locationManager.enableBluetooth();        
      }
    })
    .fail(function(e) { console.error(e); })
    .done();

    cordova.plugins.locationManager.setDelegate(delegate);

    // required in iOS 8+
    //cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
    cordova.plugins.locationManager.requestAlwaysAuthorization()

    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
        .fail(console.error)
        .done();


  });

  $scope.$on("wf.show.path", function(event, poi){
    console.log("wf.show.path", poi.getNode(), poi)
    wayfinder.showPath(poi.getNode(), poi);
  });

  $scope.$on("wf.data.loaded", function(event, poi){
    $cordovaSplashscreen.hide();
  });
}])
.controller('TopicsController', ['$scope', 'wfangular3d', '$state', function($scope, wayfinder, $state) {
  $scope.topics = wayfinder.getPOIGroups();

  $scope.go = function(){
    console.log("go")
    $state.go("tab.topic", {id: 1});
  }
}])
.controller('AZController', function($scope, wfangular3d) {
  var language = wfangular3d.getLanguage();
  $scope.pois = wfangular3d.getPOIs();
  $scope.poiKeys = Object.keys($scope.pois).sort(function(a,b){
    if($scope.pois[a].getName(language) && $scope.pois[b].getName(language))
        return $scope.pois[a].getName(language).toLowerCase().trim().localeCompare($scope.pois[b].getName(language).toLowerCase().trim());
  });

})
.controller('POIController', function($scope, $rootScope, $stateParams, wfangular3d, $state) {
  var id = $stateParams.id;
  $scope.poi = wfangular3d.pois[id];

  $scope.showPath = function(){
    $rootScope.$broadcast("wf.show.path", $scope.poi);
    $state.go("tab.map");
  }

})
.controller('TopicPOIsController', function($scope, $stateParams, wfangular3d) {
  var id = $stateParams.id;
  $scope.group = wfangular3d.getPOIGroups()[id];
  console.log("TopicPOIsController", $stateParams.id, $scope.pois)

})
.controller('SettingsController', ['$scope', '$localStorage', '$window', function($scope, storage, $window) {
  $scope.form = {project: storage.project};

  $scope.onSave = function(){
    storage.project = $scope.form.project;

    console.log("project", $scope.form);
    $window.location.reload(true);
  }
}]);