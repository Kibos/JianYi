(function() {
    'use strict';
  angular
    .module('app')
  .run(['$rootScope', '$state', "$log", function($rootScope, $state, $log) {
      $log.log("run state");
      $rootScope.$on('$stateChangeStart', function(event, next) {

      });
    }]);

})();