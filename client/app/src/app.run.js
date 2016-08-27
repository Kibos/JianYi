(function() {
    'use strict';
  angular
    .module('app')
    .run(function($rootScope, $state, $log, PermRoleStore, appConf) {
        $log.log("run state");
        
        PermRoleStore.defineRole('role', [],function(stateParams) {
            console.log(stateParams)
            return false;
        });

        // PermRoleStore.defineRole('isAuthorized', function() {
        // return true;
        // });
        
        // PermRoleStore.defineRole('login', function() {
        // return true;
        // });
        // PermRoleStore
        // .defineRole('isAuthorized', ['isAuthorized', 'viewCharts', 'viewMaps']);
        
        //         // function that calls user service to check if permission is allowed
        // function checkRole(permission, transitionProperties) {
        //     // return User.hasPermission(permission, transitionProperties);
        //     console.log(permission)
        //     console.log(transitionProperties)
        //     return true;
        // }

        $rootScope.$on('$stateChangeStart', function(event, next) {

        });
      });

})();