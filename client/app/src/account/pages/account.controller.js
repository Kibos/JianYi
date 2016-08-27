(function() {
    'use strict';
angular
    .module('app.account')
    .controller('accountController', accountController);

/* @ngInject */
function accountController($state, User) {
    var vm = this;
    vm.user = {
      name: 'John Doe',
      email: '',
      phone: '',
      address: 'Mountain View, CA',
      donation: 19.99
    };
    function getUsers() {
        User.findNotVerfiedUsers(function(resp){
            // console.log(resp);
            vm.userList = resp;
        });
    }
    getUsers()
}
})();



