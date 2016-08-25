(function() {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        // Setup the apps routes

        // 404 & 500 pages
        $stateProvider
        .state('index', {
          url: '/',
          templateUrl: '../index.html',
          authenticate: true
        })
        .state('commodity', {
          url: '/commodity/modify',
          templateUrl: 'app/src/commodity/commodity_index.html',
          authenticate: true
        })
        .state('commodity_add_category', {
          url: '/commodity/commodity_add_category',
          templateUrl: 'app/src/commodity/commodity_add_category.html',
          authenticate: true
        })
        .state('order', {
          url: '/order/order_my',
          templateUrl: 'app/src/order/order_my.html',
          authenticate: true
        });

        // .state('404', {
        //     url: '/404',
        //     views: {
        //         'root': {
        //             templateUrl: '404.tmpl.html',
        //             controller: 'ErrorPageController',
        //             controllerAs: 'vm'
        //         }
        //     }
        // })

        // .state('401', {
        //     url: '/401',
        //     views: {
        //         'root': {
        //             templateUrl: '401.tmpl.html',
        //             controller: 'ErrorPageController',
        //             controllerAs: 'vm'
        //         }
        //     }
        // })

        // .state('500', {
        //     url: '/500',
        //     views: {
        //         'root': {
        //             templateUrl: '500.tmpl.html',
        //             controller: 'ErrorPageController',
        //             controllerAs: 'vm'
        //         }
        //     }
        // });


        // set default routes when no path specified
        //$urlRouterProvider.when('', '/dashboards/analytics');
        //$urlRouterProvider.when('/', '/dashboards/analytics');
        // $urlRouterProvider.when('');

        // always goto 404 if route not found
        // $urlRouterProvider.otherwise('/404');
    }
})();
