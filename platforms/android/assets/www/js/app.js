// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'app.controllers', 'app.services', 'jett.ionic.filter.bar', 'wf.api'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.run(['wfangular3d', 'wf.api.config', '$localStorage', function(wayfinder, wfConfig, storage) {
  if(!storage.project)
    storage.project = "af59cda079cc916bee6557134c110e86";
  wayfinder.options.assetsLocation = 'http://static.3dwayfinder.com/shared/';
  wfConfig.location = "http://api.3dwayfinder.com";
  wfConfig.project = storage.project
  wayfinder.open(storage.project);
}])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider
  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      controller: 'TabsController'
    })
    .state('tab.map', {
      url: '/map',
      preload: true,
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapController'
        }
      }
    })
    .state('tab.topics', {
      url: '/topics',
      preload: true,
      views: {
        'tab-topics': {
          templateUrl: 'templates/tab-topics.html',
          controller: 'TopicsController'
        }
      }
    })
    .state('tab.topic', {
      url: '/topic/:id',
      views: {
        'tab-topics': {
          templateUrl: 'templates/tab-topics-pois.html',
          controller: 'TopicPOIsController'
        }
      }
    })
    .state('tab.az', {
      url: '/az',
      views: {
        'tab-az': {
          templateUrl: 'templates/tab-az.html',
          controller: 'AZController'
        }
      }
    })
    .state('tab.poi', {
      url: '/poi/:id',
      views: {
        'tab-az': {
          templateUrl: 'templates/tab-poi.html',
          controller: 'POIController'
        }
      }
    })
    .state('tab.settings', {
      url: '/settings',
      views: {
        'tab-az': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'SettingsController'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');

});