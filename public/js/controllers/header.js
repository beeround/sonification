'use strict';
angular.module('sonificationAPP.controllers.header', []).

controller('headerCtrl', function ($scope, $http, $location) {
    $scope.goToCompare = function () {
        $location.path('/app/compare');
    }

});

