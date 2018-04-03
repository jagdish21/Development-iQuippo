(function () {
    'use strict';

    angular.module('sreizaoApp').factory('socketSvc', socketSvc);

    function socketSvc(socketFactory) {
        return socketFactory();
    }
})();
