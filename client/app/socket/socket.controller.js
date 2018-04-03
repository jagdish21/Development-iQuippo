'use strict';
angular.module('myApp').controller('socketCtrl', SocketCtrl);

function ProductBidRequestCtrl($scope, $rootScope, socketSvc) {
 socketSvc.on('onSubmitBidSocket',function (data){
       updateData();
       console.log("I am leaving")
    });
 function updateData() {
   console.log("Data updated....");
 }
}
})();
   
