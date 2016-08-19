(function() {
    'use strict';
    angular
        .module('app.account' )
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$urlRouterProvider) 
        {
            $stateProvider
            .state('account', {
                url:'/account',
                template:'<div ui-view></div>',
                abstract: true
            })
            .state('account.account-define', {
                    url: '/accountdefine',
                    templateUrl: 'app/src/account/pages/account-define.tmpl.html',
                    controller: 'accountController',
                    controllerAs: 'vm'
            });
        }]);
})();

