// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app', [
    'ui.router',
    "lbServices"
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('commodity', {
        url: '/commodity/modify',
        templateUrl: 'app/src/commodity/commodity_modify.html',
        authenticate: true
      })
      .state('order', {
        url: '/order/order_my',
        templateUrl: 'app/src/order/order_my.html',
        authenticate: true
      })
    ;
    $urlRouterProvider.otherwise('all-reviews');
  }])
  .run(['$rootScope', '$state', "$log", function($rootScope, $state, $log) {
    $log.log("run state");
    $rootScope.$on('$stateChangeStart', function(event, next) {

    });
  }]);
