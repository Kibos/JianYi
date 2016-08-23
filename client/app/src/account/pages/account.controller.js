(function() {
    'use strict';
angular
    .module('app.account')
    .controller('accountController', accountController);

/* @ngInject */
function accountController($state, User) {
    var vm = this;

    User.login()
}
})();