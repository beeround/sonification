'use strict';
angular.module('sonificationAPP.controllers.main', []).

controller('mainCtrl', function ($scope, $http, $location) {
    $scope.goToCompare = function () {
        $location.path('/app/compare');
    }

});

