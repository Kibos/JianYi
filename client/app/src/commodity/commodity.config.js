(function() {
    'use strict';
    angular
        .module('app.commodity' )
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$urlRouterProvider)
        {
            $stateProvider
            .state('commodity', {
                url:'/commodity',
                template:'<div ui-view></div>',
                abstract: true
            })
            .state('commodity.commodity-index', {
                    url: '/commodityindex',
                    templateUrl: 'app/src/commodity/pages/commodity-index.tmpl.html',
                    controller: 'commodityController',
                    controllerAs: 'vm'
            });
        }]);
})();
