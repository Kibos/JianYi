(function() {
    'use strict';
angular
    .module('app.commodity')
    .controller('commodityController', commodityController);

/* @ngInject */
function commodityController($state, Product) {
    var vm = this;
    vm.productList;
    console.log("start log");
    Product.find({},function(res){
             vm.productList=res;
             console.log("KKK:"+res);
         });

}
})();
