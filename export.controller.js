(function(){
'use strict';
angular.module('modulename').controller('ExportController', ExportController);
 
function ExportController($scope, $rootScope, ExportSvc, Model) {
  var vm = this;
  vm.exportData = exportData;
}

});
function exportData(type) {
  var filters = {};
  filters.limit = 500;
  filters.type = type;
  ExportSvc.exportExcel(filters);
}
