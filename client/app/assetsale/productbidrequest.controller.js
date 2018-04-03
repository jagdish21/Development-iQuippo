'use strict';
angular.module('sreizaoApp').controller('ProductBidRequestCtrl', ProductBidRequestCtrl);

function ProductBidRequestCtrl($scope, $rootScope, $window, $uibModal, $stateParams,$state, productSvc, socketSvc, Modal, Auth, AssetSaleSvc,PagerSvc,uploadSvc) {
 socketSvc.on('onSubmitBidSocket',function (data){
       getBidData(angular.copy(initFilter));
       console.log("I am leaving")
    });
}
})();
   
