// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
(function() {
    'use strict';
angular
  .module('app', [
    'ui.router',
    'permission',
    'permission.ui',
    'lbServices',
    'app.account',
    'ui.bootstrap',
    'ngTouch',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'md.data.table',
    'demoapp'


  ])
  .controller('appController', function($state) {
    // variables

    // // methods
    // this.authorize = authorize;
    // this.toggleMenu = toggleMenu;

    // function authorize() {
    //   appConf.isAuthorized = !appConf.isAuthorized;
    //   $state.reload();
    // }

    // function toggleMenu() {
    //   appConf.isCollapsed = !appConf.isCollapsed;
    // }
  });

})();